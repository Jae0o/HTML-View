import { useState } from "react";

import { type RegisteredFolder, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import { BrandLogo, Button, ConfirmDialog, TextInput } from "@views/components/common";
import { FolderIcon } from "@views/components/icons";
import { TreeRow } from "@views/components/viewer";

import { EMPTY_FOLDER_LABEL, ROOT_FOLDER_LABEL } from "../../DocumentList.constants";
import { Collapse } from "../Collapse";
import { FavoriteButton } from "../FavoriteButton";
import { HiddenFoldersDialog } from "../HiddenFoldersDialog";
import { HtmlFolderRows } from "../HtmlFolderRows";
import { MoreMenu } from "../MoreMenu";

interface FolderRowsProps {
  folder: RegisteredFolder;
  /** 검색 중 — 접어 둔 폴더도 펼쳐서 보여 준다. 그동안은 줄을 눌러도 접히지 않는다 */
  forceExpanded?: boolean;
  /** 검색에서 문서 이름이 맞은 HTML 폴더의 경로 — 그 폴더는 펼쳐서 보여 준다 */
  forceExpandedPaths?: string[];
}

const NO_PATHS: string[] = [];

/** 등록 폴더 한 줄과 그 안의 HTML 폴더 줄들. 줄 오른쪽 끝 ⋯ 메뉴의 「이름 변경」 입력 창 · 「숨긴 폴더」 창 · 「등록 해제」 확인 창도 여기서 띄운다 */
const FolderRows = ({ folder, forceExpanded = false, forceExpandedPaths = NO_PATHS }: FolderRowsProps) => {
  const reconnect = useFolderStore(state => state.reconnect);
  const removeFolder = useFolderStore(state => state.removeFolder);
  const renameFolder = useFolderStore(state => state.renameFolder);
  const showPath = useFolderStore(state => state.showPath);
  const removeFavoritesOfFolder = useViewerStore(state => state.removeFavoritesOfFolder);
  // 보일 문서가 없을 때의 문구는 켜진 형식을 따른다 — 목록은 이미 그 형식으로 거른 등록 폴더를 받는다
  const emptyLabel = useViewerStore(state =>
    state.visibleFormats.length === 2 ? EMPTY_FOLDER_LABEL.all : EMPTY_FOLDER_LABEL[state.visibleFormats[0]],
  );

  // 등록 폴더는 처음에 펼쳐 있다
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isHiddenOpen, setIsHiddenOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const isConnected = folder.status === "connected";
  const hasHidden = folder.hiddenPaths.length > 0;
  const isOpen = isConnected && (forceExpanded || isExpanded);

  // 입력 칸은 지금 이름을 채운 채 연다
  const openRename = () => {
    setNameInput(folder.name);
    setIsRenameOpen(true);
  };

  // 비우고 저장하면 스토어가 실제 폴더 이름으로 되돌린다
  const handleRename = async () => {
    setIsRenameOpen(false);
    await renameFolder(folder.id, nameInput);
  };

  // 숨긴 폴더가 다 없어지면 창을 닫는다 — 열림 상태가 남으면 다음에 숨길 때 창이 저절로 뜬다. 그리는 중에 바로 맞춘다
  if (isHiddenOpen && !hasHidden) setIsHiddenOpen(false);

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
            <MoreMenu
              items={[
                { label: "이름 변경", onSelect: openRename },
                // 숨긴 폴더가 있을 때만 보인다
                ...(hasHidden ? [{ label: "숨긴 폴더", onSelect: () => setIsHiddenOpen(true) }] : []),
                { label: "등록 해제", onSelect: () => setIsRemoveOpen(true) },
              ]}
            />
          </>
        }
        onClick={isConnected && !forceExpanded ? () => setIsExpanded(previous => !previous) : undefined}
      />

      {/* 접어도 안쪽 줄을 지우지 않는다 — HTML 폴더를 펼쳐 둔 상태가 남는다 */}
      <Collapse open={isOpen}>
        {folder.htmlFolders.length === 0 && (
          <p className="m-0 flex h-32 items-center pl-24 text-sm text-text-tertiary">{emptyLabel}</p>
        )}
        {folder.htmlFolders.map(htmlFolder => (
          <HtmlFolderRows
            key={htmlFolder.path}
            folderId={folder.id}
            htmlFolder={htmlFolder}
            label={htmlFolder.path || ROOT_FOLDER_LABEL}
            forceExpanded={forceExpandedPaths.includes(htmlFolder.path)}
          />
        ))}
      </Collapse>

      <ConfirmDialog
        open={isRenameOpen}
        title="폴더 이름 변경"
        description={
          <>
            <BrandLogo size="s" /> 목록에만 보이는 이름입니다. 실제 폴더 이름은 바뀌지 않습니다.
          </>
        }
        confirmLabel="변경"
        onConfirm={handleRename}
        onCancel={() => setIsRenameOpen(false)}
      >
        {/* 열리면 이 칸에 포커스가 가고 글자 전체가 선택된다. 비우면 실제 폴더 이름이 흐리게 보인다 */}
        <TextInput
          aria-label="폴더 이름"
          value={nameInput}
          placeholder={folder.handle.name}
          onChange={e => setNameInput(e.target.value)}
          onFocus={e => e.currentTarget.select()}
          onKeyDown={e => {
            // 한글 조합 중 Enter 는 글자를 확정하는 키라 저장하지 않는다
            if (e.key === "Enter" && !e.nativeEvent.isComposing) handleRename();
          }}
        />
      </ConfirmDialog>

      <HiddenFoldersDialog
        open={isHiddenOpen}
        folderName={folder.name}
        hiddenPaths={folder.hiddenPaths}
        onShow={path => showPath(folder.id, path)}
        onClose={() => setIsHiddenOpen(false)}
      />

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
