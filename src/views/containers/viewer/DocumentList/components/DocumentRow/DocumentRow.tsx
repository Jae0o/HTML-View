import type { DocumentEntry } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import { FileHtmlIcon } from "@views/components/icons";
import { TreeRow, type TreeRowDepth } from "@views/components/viewer";

import { FavoriteButton } from "../FavoriteButton";

interface DocumentRowProps {
  folderId: string;
  /** 문서가 든 HTML 폴더의 경로 */
  path: string;
  document: DocumentEntry;
  depth: TreeRowDepth;
}

/** 문서 한 줄 — 누르면 그 문서를 연다 */
const DocumentRow = ({ folderId, path, document, depth }: DocumentRowProps) => {
  const isSelected = useViewerStore(
    state =>
      state.selectedDocument?.folderId === folderId &&
      state.selectedDocument.path === path &&
      state.selectedDocument.fileName === document.fileName,
  );
  const selectDocument = useViewerStore(state => state.selectDocument);

  return (
    <TreeRow
      depth={depth}
      label={document.name}
      icon={<FileHtmlIcon className={isSelected ? "shrink-0" : "shrink-0 text-text-tertiary"} />}
      selected={isSelected}
      actions={<FavoriteButton item={{ kind: "document", folderId, path, fileName: document.fileName }} />}
      onClick={() => selectDocument({ folderId, path, fileName: document.fileName })}
    />
  );
};

export default DocumentRow;
