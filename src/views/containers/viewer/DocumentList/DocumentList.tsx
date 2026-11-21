import { Fragment, useState } from "react";

import { isFolderPickerSupported, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import { Button, FloatingSurface, IconButton, Tag, Tooltip } from "@views/components/common";
import { FileHtmlIcon, FolderIcon, FolderPlusIcon, MenuIcon } from "@views/components/icons";
import { SectionHeader, TreeRow } from "@views/components/viewer";

import { ROOT_FOLDER_LABEL } from "./DocumentList.constants";

/** 문서 목록 — 본문 위 왼쪽에 떠 있다. 접으면 열기 버튼만 남는다 */
const DocumentList = () => {
  const isListOpen = useViewerStore(state => state.isListOpen);
  const toggleList = useViewerStore(state => state.toggleList);
  const isRestored = useFolderStore(state => state.isRestored);
  const folders = useFolderStore(state => state.folders);
  const addFolder = useFolderStore(state => state.addFolder);
  const reconnect = useFolderStore(state => state.reconnect);

  // 처음 상태에서 뒤집힌 줄만 기억한다 — 등록 폴더는 처음에 펼쳐 있고, HTML 폴더는 접혀 있다
  const [flippedKeys, setFlippedKeys] = useState<ReadonlySet<string>>(new Set());

  const flip = (key: string) =>
    setFlippedKeys(previous => {
      const next = new Set(previous);

      if (!next.delete(key)) next.add(key);

      return next;
    });

  // 폴더를 열 수 없는 브라우저에서는 목록도 열기 버튼도 두지 않는다.
  // 저장된 폴더를 불러오기 전에도 그리지 않는다 — 빈 목록이 잠깐 비치거나, 불러오는 중에 폴더를 추가하는 일을 막는다
  if (!isFolderPickerSupported() || !isRestored) return null;

  if (!isListOpen) {
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
                  const key = `${folder.id}/${htmlFolder.path}`;
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
                        htmlFolder.documents.map(document => (
                          <TreeRow
                            key={document.fileName}
                            depth={2}
                            label={document.name}
                            icon={<FileHtmlIcon className="shrink-0 text-text-tertiary" />}
                          />
                        ))}
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
