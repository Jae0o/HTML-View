import { useState } from "react";

import { filterFolders, findDocument, isFolderPickerSupported, useFolderStore } from "@libs/features/folder";
import { favoriteKey, resolveFavorites, useViewerStore } from "@libs/features/viewer";

import { FloatingSurface, IconButton, SearchInput, Tooltip } from "@views/components/common";
import { FolderPlusIcon, MenuIcon, StarIcon } from "@views/components/icons";
import { SectionHeader } from "@views/components/viewer";

import { favoriteLabel, filterFavorites } from "./DocumentList.utils";
import { DocumentRow, FolderRows, HtmlFolderRows } from "./components";
import { useClickAway } from "./hooks";

// 목록 상자 — 닫혀 있을 때는 그리지 않고 감추기만 한다(줄의 펼침 상태가 남는다)
const SURFACE_CLASS = "absolute top-12 left-16 z-400 flex max-h-[calc(100vh-2.4rem)] w-[48rem] flex-col gap-8 p-12";
const SURFACE_HIDDEN_CLASS = "hidden";

/** 문서 목록 — 본문 위 왼쪽에 떠 있다. 접거나 문서를 고르면 열기 버튼만 남는다 */
const DocumentList = () => {
  const isListVisible = useViewerStore(state => state.isListOpen && !state.isListDismissed);
  const selectedDocument = useViewerStore(state => state.selectedDocument);
  const toggleList = useViewerStore(state => state.toggleList);
  const dismissList = useViewerStore(state => state.dismissList);
  const favorites = useViewerStore(state => state.favorites);
  const isFavoritesView = useViewerStore(state => state.listView === "favorites");
  const toggleListView = useViewerStore(state => state.toggleListView);
  const isRestored = useFolderStore(state => state.isRestored);
  const folders = useFolderStore(state => state.folders);
  const addFolder = useFolderStore(state => state.addFolder);
  const isDocumentShown = useFolderStore(
    state => selectedDocument !== null && findDocument(state.folders, selectedDocument) !== undefined,
  );

  // 고른 문서를 찾을 수 있을 때만 목록 밖을 누르면 닫는다 — 빈 화면 · 문서를 찾지 못한 화면에서는 닫지 않는다
  const markInside = useClickAway(isListVisible && isDocumentShown, dismissList);

  // 검색어는 기억하지 않는다 — 입력하는 대로 목록을 거른다
  const [query, setQuery] = useState("");
  const isSearching = query.trim() !== "";
  // 검색 칸은 보기를 따라간다 — 전체 보기에서는 폴더 · 문서 이름을, 즐겨찾기 보기에서는 즐겨찾기 이름을 거른다
  const matches = isFavoritesView ? [] : filterFolders(folders, query);
  const visibleFavorites = isFavoritesView ? filterFavorites(resolveFavorites(favorites, folders), query) : [];
  const searchLabel = isFavoritesView ? "즐겨찾기 검색" : "폴더 · 문서 검색";
  const isEmpty = isFavoritesView ? visibleFavorites.length === 0 : matches.length === 0;

  // 폴더를 열 수 없는 브라우저에서는 목록도 열기 버튼도 두지 않는다.
  // 저장된 폴더를 불러오기 전에도 그리지 않는다 — 빈 목록이 잠깐 비치거나, 불러오는 중에 폴더를 추가하는 일을 막는다
  if (!isFolderPickerSupported() || !isRestored) return null;

  return (
    <>
      {!isListVisible && (
        <div className="absolute top-12 left-16">
          <Tooltip label="목록 열기">
            <IconButton
              floating
              aria-label="목록 열기"
              icon={<MenuIcon />}
              onClick={toggleList}
            />
          </Tooltip>
        </div>
      )}

      <FloatingSurface
        role="navigation"
        aria-label="문서 목록"
        onPointerDown={markInside}
        className={isListVisible ? SURFACE_CLASS : SURFACE_HIDDEN_CLASS}
      >
        <div className="flex items-center gap-8">
          <SearchInput
            aria-label={searchLabel}
            placeholder={searchLabel}
            value={query}
            onChange={event => setQuery(event.target.value)}
            className="flex-1"
          />
          <Tooltip label={isFavoritesView ? "전체 보기" : "즐겨찾기만 보기"}>
            <IconButton
              variant="ghost"
              aria-label="즐겨찾기만 보기"
              pressed={isFavoritesView}
              icon={<StarIcon fill={isFavoritesView ? "currentColor" : "none"} />}
              onClick={toggleListView}
            />
          </Tooltip>
          <Tooltip label="목록 접기">
            <IconButton
              variant="ghost"
              aria-label="목록 접기"
              icon={<MenuIcon />}
              onClick={toggleList}
            />
          </Tooltip>
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
          {matches.map(({ folder, documentMatchedPaths }) => (
            <FolderRows
              key={folder.id}
              folder={folder}
              forceExpanded={isSearching}
              forceExpandedPaths={documentMatchedPaths}
            />
          ))}

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
