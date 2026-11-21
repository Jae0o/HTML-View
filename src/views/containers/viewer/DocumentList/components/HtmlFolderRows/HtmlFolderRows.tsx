import { useState } from "react";

import type { HtmlFolder } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import { Tag } from "@views/components/common";
import { TreeRow } from "@views/components/viewer";

import { Collapse } from "../Collapse";
import { DocumentRow } from "../DocumentRow";
import { FavoriteButton } from "../FavoriteButton";

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

/** HTML 폴더 한 줄과 그 안의 문서 줄들 */
const HtmlFolderRows = ({ folderId, htmlFolder, label, depth = 1, forceExpanded = false }: HtmlFolderRowsProps) => {
  // 처음에는 접혀 있다. 다시 들어왔을 때 보던 문서의 줄이 보이도록, 그 문서가 든 폴더만 펼친 채로 시작한다
  const [isExpanded, setIsExpanded] = useState(() => {
    const { selectedDocument } = useViewerStore.getState();

    return selectedDocument?.folderId === folderId && selectedDocument.path === htmlFolder.path;
  });

  const isOpen = forceExpanded || isExpanded;

  return (
    <>
      <TreeRow
        depth={depth}
        label={label}
        expanded={isOpen}
        trailing={<Tag>{htmlFolder.documents.length}</Tag>}
        actions={<FavoriteButton item={{ kind: "htmlFolder", folderId, path: htmlFolder.path }} />}
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
    </>
  );
};

export default HtmlFolderRows;
