import { useState } from "react";

import type { HtmlFolder } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import { Tag } from "@views/components/common";
import { TreeRow } from "@views/components/viewer";

import { DocumentRow } from "../DocumentRow";

interface HtmlFolderRowsProps {
  folderId: string;
  htmlFolder: HtmlFolder;
  /** 줄 이름 */
  label: string;
}

/** HTML 폴더 한 줄과 그 안의 문서 줄들 */
const HtmlFolderRows = ({ folderId, htmlFolder, label }: HtmlFolderRowsProps) => {
  // 처음에는 접혀 있다. 다시 들어왔을 때 보던 문서의 줄이 보이도록, 그 문서가 든 폴더만 펼친 채로 시작한다
  const [isExpanded, setIsExpanded] = useState(() => {
    const { selectedDocument } = useViewerStore.getState();

    return selectedDocument?.folderId === folderId && selectedDocument.path === htmlFolder.path;
  });

  return (
    <>
      <TreeRow
        depth={1}
        label={label}
        expanded={isExpanded}
        trailing={<Tag>{htmlFolder.documents.length}</Tag>}
        onClick={() => setIsExpanded(previous => !previous)}
      />

      {isExpanded &&
        htmlFolder.documents.map(document => (
          <DocumentRow
            key={document.fileName}
            folderId={folderId}
            path={htmlFolder.path}
            document={document}
            depth={2}
          />
        ))}
    </>
  );
};

export default HtmlFolderRows;
