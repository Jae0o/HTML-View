import { useRef, useState } from "react";

import { filterFolders, findDocument, isFolderPickerSupported, useFolderStore } from "@libs/features/folder";
import { favoriteKey, filterFoldersByFormat, resolveFavorites, useViewerStore } from "@libs/features/viewer";
import { useEscClose } from "@libs/hooks/common";

import { FloatingSurface, IconButton, SearchInput, Tooltip } from "@views/components/common";
import { FileHtmlIcon, FolderPlusIcon, HelpIcon, MarkdownIcon, MenuIcon, StarIcon } from "@views/components/icons";
import { SectionHeader } from "@views/components/viewer";

import { favoriteLabel, filterFavorites } from "./DocumentList.utils";
import { DocumentRow, FilterChip, FolderRows, HtmlFolderRows, SortableFolderRows } from "./components";
import { useClickAway, useListFocus } from "./hooks";

// 목록 상자 — 닫혀 있을 때는 지우지 않고 감추기만 한다(줄의 펼침 상태가 남는다).
// 열 때는 접기 버튼 자리(= 닫혔을 때의 열기 버튼 자리)에서 펼쳐지고, 닫을 때는 그 자리로 접혀 들어간다 — 보이는 영역(clip-path)을 200ms 동안 넓히고 좁힌다.
// 접힌 영역: 위 · 왼쪽 1.3rem(테두리 1px + 안쪽 여백 12px)에서 접기 · 도움말 버튼 두 개(3.2 + 0.8 + 3.2 = 7.2rem) · 높이 3.2rem 만큼. 펼친 영역은 그림자가 잘리지 않게 상자보다 4rem 넓게 둔다.
// 창이 480px 보다 좁으면 좌우 16px 를 남기고 창 폭에 맞춰 줄어든다.
// 흐려지지 않는다 — 접기 아이콘이 끝까지 보여야 열기 버튼으로 바뀔 때 깜빡이지 않는다.
// 움직임 줄이기 설정이면 영역은 그대로 두고 흐려지기만 한다. 사라지는 동안은 누름을 받지 않는다
const SURFACE_OPEN_CLASS =
  "absolute top-12 left-16 z-400 flex max-h-[calc(100vh-2.4rem)] w-[48rem] max-w-[calc(100vw-3.2rem)] flex-col gap-8 p-12 transition-[opacity,clip-path,visibility] duration-200 motion-safe:[clip-path:inset(-4rem)]";
const SURFACE_CLOSED_CLASS =
  "pointer-events-none invisible absolute top-12 left-16 z-400 flex max-h-[calc(100vh-2.4rem)] w-[48rem] max-w-[calc(100vw-3.2rem)] flex-col gap-8 p-12 transition-[opacity,clip-path,visibility] duration-200 motion-safe:[clip-path:inset(1.3rem_calc(100%_-_8.5rem)_calc(100%_-_4.5rem)_1.3rem_round_0.6rem)] motion-reduce:opacity-0";

// 열기 · 도움말 버튼 칸 — 빈 여백은 마우스를 통과시킨다. 목록이 열리면 상자가 다 펼쳐진 뒤(200ms) 감춘다. 닫히면 바로 보인다
const OPEN_BUTTON_SHOWN_CLASS =
  "pointer-events-none absolute top-12 left-16 flex gap-8 border border-transparent p-12 transition-[visibility] duration-200";
const OPEN_BUTTON_HIDDEN_CLASS =
  "pointer-events-none invisible absolute top-12 left-16 flex gap-8 border border-transparent p-12 transition-[visibility] duration-200";

/** 문서 목록 — 본문 위 왼쪽에 떠 있다. 접거나 문서를 고르면 열기 · 도움말 버튼만 남는다 */
const DocumentList = () => {
  const isListVisible = useViewerStore(state => state.isListOpen && !state.isListDismissed);
  const selectedDocument = useViewerStore(state => state.selectedDocument);
  const toggleList = useViewerStore(state => state.toggleList);
  const dismissList = useViewerStore(state => state.dismissList);
  const favorites = useViewerStore(state => state.favorites);
  const isFavoritesView = useViewerStore(state => state.listView === "favorites");
  const toggleListView = useViewerStore(state => state.toggleListView);
  const visibleFormats = useViewerStore(state => state.visibleFormats);
  const toggleFormat = useViewerStore(state => state.toggleFormat);
  const isHtmlVisible = visibleFormats.includes("html");
  const isMdVisible = visibleFormats.includes("md");
  const isHelpOpen = useViewerStore(state => state.isHelpOpen);
  const openHelp = useViewerStore(state => state.openHelp);
  const isRestored = useFolderStore(state => state.isRestored);
  const folders = useFolderStore(state => state.folders);
  const addFolder = useFolderStore(state => state.addFolder);
  const isDocumentShown = useFolderStore(
    state => selectedDocument !== null && findDocument(state.folders, selectedDocument) !== undefined,
  );

  // 고른 문서를 찾을 수 있을 때만 목록 밖을 누르면 닫는다 — 빈 화면 · 문서를 찾지 못한 화면에서는 닫지 않는다.
  // 도움말 창이 열려 있는 동안도 닫지 않는다 — 창은 목록 밖에 그려져, 창 안을 누르면 목록 밖 누름으로 센다
  const isDismissible = isListVisible && isDocumentShown && !isHelpOpen;
  const markInside = useClickAway(isDismissible, dismissList);

  // Esc 도 목록 밖 누름과 같은 조건에서 닫는다 (결정 Q2). 메뉴 · 창이 열려 있으면 그것만 닫히게 목록은 그대로 둔다
  useEscClose(isDismissible, () => {
    if (document.querySelector('dialog[open], [role="menu"]')) return;

    dismissList();
  });

  // 열고 닫을 때 누른 버튼이 숨어도 포커스가 사라지지 않게 옮긴다 (결정 D4)
  const surfaceRef = useRef<HTMLDivElement>(null);
  const openButtonsRef = useRef<HTMLDivElement>(null);
  useListFocus(isFolderPickerSupported() && isRestored, isListVisible, surfaceRef, openButtonsRef);

  // 검색어는 기억하지 않는다 — 입력하는 대로 목록을 거른다
  const [query, setQuery] = useState("");
  const isSearching = query.trim() !== "";
  // 꺼진 형식의 문서를 먼저 뺀다 — 검색 · 즐겨찾기는 이 목록 하나로 거른다 (결정 MD-A3)
  const visibleFolders = filterFoldersByFormat(folders, visibleFormats);
  // 검색 칸은 보기를 따라간다 — 전체 보기에서는 폴더 · 문서 이름을, 즐겨찾기 보기에서는 즐겨찾기 이름을 거른다
  const matches = isFavoritesView ? [] : filterFolders(visibleFolders, query);
  const visibleFavorites = isFavoritesView ? filterFavorites(resolveFavorites(favorites, visibleFolders), query) : [];
  const searchLabel = isFavoritesView ? "즐겨찾기 검색" : "폴더 · 문서 검색";
  const isEmpty = isFavoritesView ? visibleFavorites.length === 0 : matches.length === 0;

  // 폴더를 열 수 없는 브라우저에서는 목록도 열기 버튼도 두지 않는다.
  // 저장된 폴더를 불러오기 전에도 그리지 않는다 — 빈 목록이 잠깐 비치거나, 불러오는 중에 폴더를 추가하는 일을 막는다
  if (!isFolderPickerSupported() || !isRestored) return null;

  return (
    <>
      {/* 목록 상자와 같은 자리 · 테두리 · 안쪽 여백 · 간격을 둬, 열기 · 도움말 버튼이 상자 안 접기 · 도움말 버튼과 같은 자리에 온다.
          지우지 않고 상자 아래 층에 늘 둔다 — 열고 닫는 순간에도 이 자리의 아이콘이 비지 않는다(깜빡임 방지) */}
      <div
        ref={openButtonsRef}
        className={isListVisible ? OPEN_BUTTON_HIDDEN_CLASS : OPEN_BUTTON_SHOWN_CLASS}
      >
        <Tooltip label="목록 열기">
          <IconButton
            floating
            aria-label="목록 열기"
            icon={<MenuIcon />}
            onClick={toggleList}
            className="pointer-events-auto"
          />
        </Tooltip>
        <Tooltip label="도움말">
          <IconButton
            floating
            aria-label="도움말"
            icon={<HelpIcon />}
            onClick={openHelp}
            className="pointer-events-auto"
          />
        </Tooltip>
      </div>

      <FloatingSurface
        ref={surfaceRef}
        role="navigation"
        aria-label="문서 목록"
        onPointerDown={markInside}
        className={isListVisible ? SURFACE_OPEN_CLASS : SURFACE_CLOSED_CLASS}
      >
        {/* 접기 · 도움말 버튼을 맨 앞에 둔다 — 닫혔을 때의 열기 · 도움말 버튼과 같은 자리다 */}
        <div className="flex items-center gap-8">
          <Tooltip label="목록 접기">
            <IconButton
              variant="ghost"
              aria-label="목록 접기"
              icon={<MenuIcon />}
              onClick={toggleList}
            />
          </Tooltip>
          <Tooltip label="도움말">
            <IconButton
              variant="ghost"
              aria-label="도움말"
              icon={<HelpIcon />}
              onClick={openHelp}
            />
          </Tooltip>
          <SearchInput
            aria-label={searchLabel}
            placeholder={searchLabel}
            value={query}
            onChange={event => setQuery(event.target.value)}
            className="flex-1"
          />
        </div>

        {/* 목록 위 칩 — 즐겨찾기만 보기 · 보일 형식 (결정 MD-A1). 켜진 형식이 하나뿐이면 그 칩은 끌 수 없다 (MD-A2) */}
        <div className="flex flex-wrap gap-8">
          <FilterChip
            label="즐겨찾기"
            pressed={isFavoritesView}
            icon={
              <span className={isFavoritesView ? "inline-flex text-favorite-on" : "inline-flex"}>
                <StarIcon
                  size={16}
                  fill={isFavoritesView ? "currentColor" : "none"}
                />
              </span>
            }
            onClick={toggleListView}
          />
          <FilterChip
            label="HTML"
            pressed={isHtmlVisible}
            disabled={isHtmlVisible && visibleFormats.length === 1}
            icon={<FileHtmlIcon size={16} />}
            onClick={() => toggleFormat("html")}
          />
          <FilterChip
            label="MD"
            pressed={isMdVisible}
            disabled={isMdVisible && visibleFormats.length === 1}
            icon={<MarkdownIcon size={16} />}
            onClick={() => toggleFormat("md")}
          />
        </div>

        {isFavoritesView ? (
          <SectionHeader title="즐겨찾기" />
        ) : (
          <SectionHeader
            title="등록 폴더"
            action={
              <Tooltip label="폴더 추가">
                <IconButton
                  size="s"
                  aria-label="폴더 추가"
                  icon={<FolderPlusIcon />}
                  onClick={addFolder}
                />
              </Tooltip>
            }
          />
        )}

        <div className="flex min-h-0 flex-col overflow-y-auto">
          {/* 등록 폴더 줄을 끌어 순서를 바꾼다 — 검색 중에는 끌지 못한다 */}
          <SortableFolderRows
            matches={matches}
            isSearching={isSearching}
          />

          {/* 즐겨찾기 보기 — 켠 순서대로. 등록 폴더 · HTML 폴더는 펼쳐서 안쪽 문서까지 볼 수 있다 */}
          {visibleFavorites.map(favorite => {
            const key = favoriteKey(favorite.item);

            if (favorite.kind === "folder") {
              return (
                <FolderRows
                  key={key}
                  folder={favorite.folder}
                />
              );
            }

            if (favorite.kind === "htmlFolder") {
              return (
                <HtmlFolderRows
                  key={key}
                  folderId={favorite.folder.id}
                  htmlFolder={favorite.htmlFolder}
                  label={favoriteLabel(favorite)}
                  depth={0}
                />
              );
            }

            return (
              <DocumentRow
                key={key}
                folderId={favorite.folder.id}
                path={favorite.path}
                document={favorite.document}
                depth={0}
              />
            );
          })}

          {isEmpty && isSearching && (
            <p className="m-0 flex h-32 items-center pl-8 text-sm text-text-tertiary">검색 결과가 없습니다.</p>
          )}
          {isEmpty && !isSearching && isFavoritesView && (
            <p className="m-0 flex h-32 items-center pl-8 text-sm text-text-tertiary">
              즐겨찾기한 항목이 없습니다. 별을 눌러 추가하세요.
            </p>
          )}
        </div>
      </FloatingSurface>
    </>
  );
};

export default DocumentList;
