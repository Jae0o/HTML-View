import { useState } from "react";

import { type HtmlFolder, isHiddenPath, splitPath, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import { Tag } from "@views/components/common";
import { TreeRow } from "@views/components/viewer";

import { Collapse } from "../Collapse";
import { DocumentRow } from "../DocumentRow";
import { FavoriteButton } from "../FavoriteButton";
import { HidePathDialog } from "../HidePathDialog";
import { MoreMenu } from "../MoreMenu";

interface HtmlFolderRowsProps {
  folderId: string;
  htmlFolder: HtmlFolder;
  /** 줄 이름 */
  label: string;
  /** 줄의 단. 전체 보기에서는 1(등록 폴더 아래), 즐겨찾기 보기에서는 0 */
  depth?: 0 | 1;
  /** 검색에서 문서 이름이 맞은 폴더 — 접혀 있어도 펼쳐서 맞은 문서를 보여 준다. 그동안은 줄을 눌러도 접히지 않는다 */
  forceExpanded?: boolean;
}

// 문서 줄은 HTML 폴더 줄보다 한 단 안쪽이다
const DOCUMENT_DEPTH = { 0: 1, 1: 2 } as const;

/** HTML 폴더 한 줄과 그 안의 문서 줄들. 줄 오른쪽 끝 ⋯ 메뉴의 「숨기기」 와 숨길 폴더 고르기 창도 여기서 띄운다 */
const HtmlFolderRows = ({ folderId, htmlFolder, label, depth = 1, forceExpanded = false }: HtmlFolderRowsProps) => {
  // 처음에는 접혀 있다. 다시 들어왔을 때 보던 문서의 줄이 보이도록, 그 문서가 든 폴더만 펼친 채로 시작한다
  const [isExpanded, setIsExpanded] = useState(() => {
    const { selectedDocument } = useViewerStore.getState();

    return selectedDocument?.folderId === folderId && selectedDocument.path === htmlFolder.path;
  });

  const hidePath = useFolderStore(state => state.hidePath);
  const closeDocument = useViewerStore(state => state.closeDocument);
  const [isHideOpen, setIsHideOpen] = useState(false);

  const isOpen = forceExpanded || isExpanded;
  const isNested = splitPath(htmlFolder.path).length > 1;

  const hide = async (path: string) => {
    setIsHideOpen(false);
    if (!(await hidePath(folderId, path))) return;

    // 보던 문서가 숨긴 폴더 안이면 닫는다 — 그대로 두면 「문서를 열 수 없습니다」 가 떠 원인이 틀리게 보인다
    const { selectedDocument } = useViewerStore.getState();
    if (selectedDocument?.folderId === folderId && isHiddenPath(selectedDocument.path, [path])) closeDocument();
  };

  // 폴더가 하나뿐인 경로(최상위 포함)는 고를 것이 없어 창 없이 바로 숨긴다
  const openHide = () => {
    if (isNested) setIsHideOpen(true);
    else hide(htmlFolder.path);
  };

  return (
    <>
      <TreeRow
        depth={depth}
        label={label}
        expanded={isOpen}
        trailing={<Tag>{htmlFolder.documents.length}</Tag>}
        actions={
          <>
            <FavoriteButton item={{ kind: "htmlFolder", folderId, path: htmlFolder.path }} />
            <MoreMenu items={[{ label: "숨기기", onSelect: openHide }]} />
          </>
        }
        onClick={forceExpanded ? undefined : () => setIsExpanded(previous => !previous)}
      />

      <Collapse open={isOpen}>
        {htmlFolder.documents.map(document => (
          <DocumentRow
            key={document.fileName}
            folderId={folderId}
            path={htmlFolder.path}
            document={document}
            depth={DOCUMENT_DEPTH[depth]}
          />
        ))}
      </Collapse>

      {isHideOpen && (
        <HidePathDialog
          path={htmlFolder.path}
          onHide={hide}
          onCancel={() => setIsHideOpen(false)}
        />
      )}
    </>
  );
};

export default HtmlFolderRows;
