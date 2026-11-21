import { findDocument, isFolderPickerSupported, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import { FloatingSurface, IconButton, Tooltip } from "@views/components/common";
import { FolderPlusIcon, MenuIcon } from "@views/components/icons";
import { SectionHeader } from "@views/components/viewer";

import { FolderRows } from "./components";
import { useClickAway } from "./hooks";

// 목록 상자 — 닫혀 있을 때는 그리지 않고 감추기만 한다(줄의 펼침 상태가 남는다)
const SURFACE_CLASS = "absolute top-12 left-16 z-400 flex max-h-[calc(100vh-2.4rem)] w-[36rem] flex-col gap-8 p-12";
const SURFACE_HIDDEN_CLASS = "hidden";

/** 문서 목록 — 본문 위 왼쪽에 떠 있다. 접거나 문서를 고르면 열기 버튼만 남는다 */
const DocumentList = () => {
  const isListVisible = useViewerStore(state => state.isListOpen && !state.isListDismissed);
  const selectedDocument = useViewerStore(state => state.selectedDocument);
  const toggleList = useViewerStore(state => state.toggleList);
  const dismissList = useViewerStore(state => state.dismissList);
  const isRestored = useFolderStore(state => state.isRestored);
  const folders = useFolderStore(state => state.folders);
  const addFolder = useFolderStore(state => state.addFolder);
  const isDocumentShown = useFolderStore(
    state => selectedDocument !== null && findDocument(state.folders, selectedDocument) !== undefined,
  );

  // 고른 문서를 찾을 수 있을 때만 목록 밖을 누르면 닫는다 — 빈 화면 · 문서를 찾지 못한 화면에서는 닫지 않는다
  const markInside = useClickAway(isListVisible && isDocumentShown, dismissList);

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
          trailing={
            <Tooltip label="목록 접기">
              <IconButton
                variant="ghost"
                aria-label="목록 접기"
                icon={<MenuIcon />}
                onClick={toggleList}
              />
            </Tooltip>
          }
        />

        <div className="flex min-h-0 flex-col overflow-y-auto">
          {folders.map(folder => (
            <FolderRows
              key={folder.id}
              folder={folder}
            />
          ))}
        </div>
      </FloatingSurface>
    </>
  );
};

export default DocumentList;
