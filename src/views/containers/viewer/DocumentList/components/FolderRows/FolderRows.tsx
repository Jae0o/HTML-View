import { useState } from "react";

import { type RegisteredFolder, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import { Button, ConfirmDialog, IconButton, Tooltip } from "@views/components/common";
import { CloseIcon, FolderIcon } from "@views/components/icons";
import { TreeRow } from "@views/components/viewer";

import { ROOT_FOLDER_LABEL, ROW_ACTION_REVEAL_CLASS } from "../../DocumentList.constants";
import { FavoriteButton } from "../FavoriteButton";
import { HtmlFolderRows } from "../HtmlFolderRows";

interface FolderRowsProps {
  folder: RegisteredFolder;
  /** 검색 중 — 접어 둔 폴더도 펼쳐서 보여 준다. 그동안은 줄을 눌러도 접히지 않는다 */
  forceExpanded?: boolean;
  /** 검색에서 문서 이름이 맞은 HTML 폴더의 경로 — 그 폴더는 펼쳐서 보여 준다 */
  forceExpandedPaths?: string[];
}

const NO_PATHS: string[] = [];

/** 등록 폴더 한 줄과 그 안의 HTML 폴더 줄들. 등록 해제 확인 창도 여기서 띄운다 */
const FolderRows = ({ folder, forceExpanded = false, forceExpandedPaths = NO_PATHS }: FolderRowsProps) => {
  const reconnect = useFolderStore(state => state.reconnect);
  const removeFolder = useFolderStore(state => state.removeFolder);
  const removeFavoritesOfFolder = useViewerStore(state => state.removeFavoritesOfFolder);

  // 등록 폴더는 처음에 펼쳐 있다
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const isConnected = folder.status === "connected";
  const isOpen = isConnected && (forceExpanded || isExpanded);

  // 등록을 해제하면 그 폴더와 안쪽 항목의 즐겨찾기도 함께 지운다
  const handleRemove = async () => {
    setIsRemoveOpen(false);

    if (await removeFolder(folder.id)) removeFavoritesOfFolder(folder.id);
  };

  return (
    <>
      <TreeRow
        depth={0}
        label={folder.name}
        icon={<FolderIcon className={isConnected ? "shrink-0 text-brand-bg" : "shrink-0 text-text-tertiary"} />}
        expanded={isConnected ? isOpen : undefined}
        actions={
          <>
            {!isConnected && (
              <Button
                variant="text"
                onClick={() => reconnect(folder.id)}
              >
                다시 연결
              </Button>
            )}
            <FavoriteButton item={{ kind: "folder", folderId: folder.id }} />
            <Tooltip label="등록 해제">
              <IconButton
                size="s"
                aria-label="등록 해제"
                icon={<CloseIcon />}
                className={ROW_ACTION_REVEAL_CLASS}
                onClick={() => setIsRemoveOpen(true)}
              />
            </Tooltip>
          </>
        }
        onClick={isConnected && !forceExpanded ? () => setIsExpanded(previous => !previous) : undefined}
      />

      {isOpen && folder.htmlFolders.length === 0 && (
        <p className="m-0 flex h-32 items-center pl-24 text-sm text-text-tertiary">HTML 문서 없음</p>
      )}

      {/* 접어도 안쪽 줄을 지우지 않고 감춘다 — HTML 폴더를 펼쳐 둔 상태가 남는다 */}
      <div className={isOpen ? "contents" : "hidden"}>
        {folder.htmlFolders.map(htmlFolder => (
          <HtmlFolderRows
            key={htmlFolder.path}
            folderId={folder.id}
            htmlFolder={htmlFolder}
            label={htmlFolder.path || ROOT_FOLDER_LABEL}
            forceExpanded={forceExpandedPaths.includes(htmlFolder.path)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={isRemoveOpen}
        tone="danger"
        title="등록을 해제할까요?"
        description={`「${folder.name}」 폴더가 목록에서 빠집니다. 파일은 지워지지 않고, 이 폴더의 즐겨찾기는 함께 지워집니다.`}
        confirmLabel="해제"
        onConfirm={handleRemove}
        onCancel={() => setIsRemoveOpen(false)}
      />
    </>
  );
};

export default FolderRows;
