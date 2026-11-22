import { findDocument, useFolderStore } from "@libs/features/folder";
import { useToastStore } from "@libs/features/toast";
import { useViewerStore } from "@libs/features/viewer";

import { IconButton, Tooltip } from "@views/components/common";
import { DownloadIcon } from "@views/components/icons";

import { DOCUMENT_ACTION_MESSAGE } from "./DocumentActions.constants";
import { downloadDocument } from "./DocumentActions.utils";

/** 열린 문서의 「다운로드」 버튼 — 화면 오른쪽 위 로고 왼쪽에 둔다. 고른 문서가 목록에 없으면 그리지 않는다 */
const DocumentActions = () => {
  const folders = useFolderStore(state => state.folders);
  const selectedDocument = useViewerStore(state => state.selectedDocument);
  const showToast = useToastStore(state => state.show);

  // 문서를 고르지 않았거나 · 찾지 못했거나 · 폴더 연결이 끊겼으면(문서 목록이 비어 있다) 버튼을 숨긴다
  const openedDocument = selectedDocument ? findDocument(folders, selectedDocument) : undefined;
  if (!openedDocument) return null;

  // 누를 때 파일을 새로 읽는다 — 뷰어가 덧붙이는 링크 지킴 코드 없이 원본 그대로 내려받는다.
  // 성공은 브라우저의 다운로드 표시가 알린다 — 실패만 알림을 띄운다
  const handleDownload = async () => {
    try {
      await downloadDocument(openedDocument.handle);
    } catch {
      showToast(DOCUMENT_ACTION_MESSAGE.downloadFailed);
    }
  };

  return (
    <Tooltip label="다운로드">
      <IconButton
        floating
        aria-label="다운로드"
        icon={<DownloadIcon />}
        onClick={handleDownload}
      />
    </Tooltip>
  );
};

export default DocumentActions;
