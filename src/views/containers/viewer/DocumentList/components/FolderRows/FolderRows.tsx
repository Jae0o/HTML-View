import { useState } from "react";

import { type RegisteredFolder, useFolderStore } from "@libs/features/folder";

import { Button, ConfirmDialog, IconButton, Tooltip } from "@views/components/common";
import { CloseIcon, FolderIcon } from "@views/components/icons";
import { TreeRow } from "@views/components/viewer";

import { ROOT_FOLDER_LABEL, ROW_ACTION_REVEAL_CLASS } from "../../DocumentList.constants";
import { HtmlFolderRows } from "../HtmlFolderRows";

interface FolderRowsProps {
  folder: RegisteredFolder;
}

/** 등록 폴더 한 줄과 그 안의 HTML 폴더 줄들. 등록 해제 확인 창도 여기서 띄운다 */
const FolderRows = ({ folder }: FolderRowsProps) => {
  const reconnect = useFolderStore(state => state.reconnect);
  const removeFolder = useFolderStore(state => state.removeFolder);

  // 등록 폴더는 처음에 펼쳐 있다
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const isConnected = folder.status === "connected";
  const isOpen = isConnected && isExpanded;

  const handleRemove = () => {
    setIsRemoveOpen(false);
    void removeFolder(folder.id);
  };

  return (
    <>
      <TreeRow
        depth={0}
        label={folder.name}
        icon={<FolderIcon className={isConnected ? "shrink-0 text-brand-bg" : "shrink-0 text-text-tertiary"} />}
        expanded={isConnected ? isExpanded : undefined}
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
        onClick={isConnected ? () => setIsExpanded(previous => !previous) : undefined}
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
          />
        ))}
      </div>

      <ConfirmDialog
        open={isRemoveOpen}
        tone="danger"
        title="등록을 해제할까요?"
        description={`「${folder.name}」 폴더가 목록에서 빠집니다. 파일은 지워지지 않습니다.`}
        confirmLabel="해제"
        onConfirm={handleRemove}
        onCancel={() => setIsRemoveOpen(false)}
      />
    </>
  );
};

export default FolderRows;
