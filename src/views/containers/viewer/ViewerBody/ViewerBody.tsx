import { findDocument, isFolderPickerSupported, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import { Button, EmptyState, Spinner } from "@views/components/common";
import { FolderPlusIcon } from "@views/components/icons";

import { withLinkGuard } from "./ViewerBody.utils";
import { useDocumentHtml } from "./hooks";

// 빈 화면 · 안내 화면을 본문 가운데에 두는 칸
const CENTER_CLASS = "flex h-full items-center justify-center p-24";

/** 본문 — 지금 상태에 맞는 화면 하나를 보여 준다 */
const ViewerBody = () => {
  const isRestored = useFolderStore(state => state.isRestored);
  const hasFolder = useFolderStore(state => state.folders.length > 0);
  const addFolder = useFolderStore(state => state.addFolder);
  const selectedDocument = useViewerStore(state => state.selectedDocument);
  const openedDocument = useFolderStore(state =>
    selectedDocument ? findDocument(state.folders, selectedDocument) : undefined,
  );
  const documentHtml = useDocumentHtml(openedDocument?.handle);

  if (!isFolderPickerSupported()) {
    return (
      <div className={CENTER_CLASS}>
        <EmptyState
          tone="muted"
          title="이 브라우저에서는 폴더를 열 수 없습니다"
          description="폴더 선택을 지원하는 브라우저에서 다시 열어 주세요."
        />
      </div>
    );
  }

  // 저장된 폴더를 불러오기 전에는 아무것도 그리지 않는다 — 「폴더 없음」 화면이 잠깐 비치지 않게
  if (!isRestored) return null;

  if (!hasFolder) {
    return (
      <div className={CENTER_CLASS}>
        <EmptyState
          title="등록된 폴더가 없습니다"
          description="HTML 문서가 든 폴더를 추가하면 목록에 모아 보여 줍니다."
          actions={
            <Button
              variant="primary"
              icon={<FolderPlusIcon />}
              onClick={addFolder}
            >
              폴더 추가
            </Button>
          }
        />
      </div>
    );
  }

  if (!selectedDocument) {
    return (
      <div className={CENTER_CLASS}>
        <EmptyState
          title="선택된 문서가 없습니다"
          description="목록에서 문서를 고르면 여기에 열립니다."
        />
      </div>
    );
  }

  if (documentHtml.status === "loading") {
    return (
      <div className={CENTER_CLASS}>
        <Spinner />
      </div>
    );
  }

  if (!openedDocument || documentHtml.status === "error") {
    return (
      <div className={CENTER_CLASS}>
        <EmptyState
          tone="muted"
          title="문서를 열 수 없습니다"
          description="파일이 옮겨졌거나 지워졌을 수 있습니다. 폴더 연결이 끊긴 경우에도 열리지 않습니다."
        />
      </div>
    );
  }

  // 문서는 권한을 좁힌 틀 안에서 연다 — 문서의 스크립트는 돌지만 이 앱의 저장소 · 화면에는 닿지 못한다
  return (
    <iframe
      title={openedDocument.name}
      srcDoc={withLinkGuard(documentHtml.html)}
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals allow-downloads"
      allow="clipboard-write"
      className="block size-full border-none"
    />
  );
};

export default ViewerBody;
