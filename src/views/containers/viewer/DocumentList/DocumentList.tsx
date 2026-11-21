import { Fragment, useState } from "react";

import { findDocument, isFolderPickerSupported, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import { Button, FloatingSurface, IconButton, Tag, Tooltip } from "@views/components/common";
import { FileHtmlIcon, FolderIcon, FolderPlusIcon, MenuIcon } from "@views/components/icons";
import { SectionHeader, TreeRow } from "@views/components/viewer";

import { ROOT_FOLDER_LABEL } from "./DocumentList.constants";
import { useClickAway } from "./hooks";

// 펼침 상태를 기억하는 HTML 폴더의 이름표
const htmlFolderKey = (folderId: string, path: string) => `${folderId}/${path}`;

/** 문서 목록 — 본문 위 왼쪽에 떠 있다. 접거나 문서를 고르면 열기 버튼만 남는다 */
const DocumentList = () => {
  const isListVisible = useViewerStore(state => state.isListOpen && !state.isListDismissed);
  const selectedDocument = useViewerStore(state => state.selectedDocument);
  const toggleList = useViewerStore(state => state.toggleList);
  const dismissList = useViewerStore(state => state.dismissList);
  const selectDocument = useViewerStore(state => state.selectDocument);
  const isRestored = useFolderStore(state => state.isRestored);
  const folders = useFolderStore(state => state.folders);
  const addFolder = useFolderStore(state => state.addFolder);
  const reconnect = useFolderStore(state => state.reconnect);
  const isDocumentShown = useFolderStore(
    state => selectedDocument !== null && findDocument(state.folders, selectedDocument) !== undefined,
  );

  // 고른 문서를 찾을 수 있을 때만 목록 밖을 누르면 닫는다 — 빈 화면 · 문서를 찾지 못한 화면에서는 닫지 않는다
  const markInside = useClickAway(isListVisible && isDocumentShown, dismissList);

  // 처음 상태에서 뒤집힌 줄만 기억한다 — 등록 폴더는 처음에 펼쳐 있고, HTML 폴더는 접혀 있다.
  // 다시 들어왔을 때 보던 문서의 줄이 보이도록 그 HTML 폴더는 펼친 채로 시작한다
  const [flippedKeys, setFlippedKeys] = useState<ReadonlySet<string>>(
    () => new Set(selectedDocument ? [htmlFolderKey(selectedDocument.folderId, selectedDocument.path)] : []),
  );

  const flip = (key: string) =>
    setFlippedKeys(previous => {
      const next = new Set(previous);

      if (!next.delete(key)) next.add(key);

      return next;
    });

  // 폴더를 열 수 없는 브라우저에서는 목록도 열기 버튼도 두지 않는다.
  // 저장된 폴더를 불러오기 전에도 그리지 않는다 — 빈 목록이 잠깐 비치거나, 불러오는 중에 폴더를 추가하는 일을 막는다
  if (!isFolderPickerSupported() || !isRestored) return null;

  if (!isListVisible) {
    return (
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
    );
  }

  return (
    <FloatingSurface
      role="navigation"
      aria-label="문서 목록"
      onPointerDown={markInside}
      className="absolute top-12 left-16 z-400 flex max-h-[calc(100vh-2.4rem)] w-[36rem] flex-col gap-8 p-12"
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
        {folders.map(folder => {
          const isConnected = folder.status === "connected";
          const isExpanded = isConnected && !flippedKeys.has(folder.id);

          return (
            <Fragment key={folder.id}>
              <TreeRow
                depth={0}
                label={folder.name}
                icon={<FolderIcon className={isConnected ? "shrink-0 text-brand-bg" : "shrink-0 text-text-tertiary"} />}
                expanded={isConnected ? isExpanded : undefined}
                actions={
                  !isConnected && (
                    <Button
                      variant="text"
                      onClick={() => reconnect(folder.id)}
                    >
                      다시 연결
                    </Button>
                  )
                }
                onClick={isConnected ? () => flip(folder.id) : undefined}
              />

              {isExpanded && folder.htmlFolders.length === 0 && (
                <p className="m-0 flex h-32 items-center pl-24 text-sm text-text-tertiary">HTML 문서 없음</p>
              )}

              {isExpanded &&
                folder.htmlFolders.map(htmlFolder => {
                  const key = htmlFolderKey(folder.id, htmlFolder.path);
                  const isHtmlFolderExpanded = flippedKeys.has(key);

                  return (
                    <Fragment key={key}>
                      <TreeRow
                        depth={1}
                        label={htmlFolder.path || ROOT_FOLDER_LABEL}
                        expanded={isHtmlFolderExpanded}
                        trailing={<Tag>{htmlFolder.documents.length}</Tag>}
                        onClick={() => flip(key)}
                      />

                      {isHtmlFolderExpanded &&
                        htmlFolder.documents.map(document => {
                          const isSelected =
                            selectedDocument?.folderId === folder.id &&
                            selectedDocument.path === htmlFolder.path &&
                            selectedDocument.fileName === document.fileName;

                          return (
                            <TreeRow
                              key={document.fileName}
                              depth={2}
                              label={document.name}
                              icon={
                                <FileHtmlIcon className={isSelected ? "shrink-0" : "shrink-0 text-text-tertiary"} />
                              }
                              selected={isSelected}
                              onClick={() =>
                                selectDocument({
                                  folderId: folder.id,
                                  path: htmlFolder.path,
                                  fileName: document.fileName,
                                })
                              }
                            />
                          );
                        })}
                    </Fragment>
                  );
                })}
            </Fragment>
          );
        })}
      </div>
    </FloatingSurface>
  );
};

export default DocumentList;
