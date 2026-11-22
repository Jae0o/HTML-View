import { type ReactNode, useRef } from "react";

import { isFolderPickerSupported, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import { Button, EmptyState, Spinner } from "@views/components/common";
import { FolderPlusIcon } from "@views/components/icons";

import { resolveBodyView, withLinkGuard } from "./ViewerBody.utils";
import { useDocumentHtml, useDocumentScroll } from "./hooks";

// 빈 화면 · 안내 화면을 본문 한가운데에 두는 칸 — 목록이 열려 있어도 자리를 옮기지 않는다
const CENTER_CLASS = "flex h-full items-center justify-center p-24";

/** 본문 — 지금 상태에 맞는 화면 하나를 보여 준다 */
const ViewerBody = () => {
  const isRestored = useFolderStore(state => state.isRestored);
  const folders = useFolderStore(state => state.folders);
  const addFolder = useFolderStore(state => state.addFolder);
  const reconnect = useFolderStore(state => state.reconnect);
  const refreshFolder = useFolderStore(state => state.refreshFolder);
  const selectedDocument = useViewerStore(state => state.selectedDocument);
  const isListVisible = useViewerStore(state => state.isListOpen && !state.isListDismissed);
  const toggleList = useViewerStore(state => state.toggleList);
  const openHelp = useViewerStore(state => state.openHelp);

  const view = resolveBodyView({ isSupported: isFolderPickerSupported(), isRestored, folders, selectedDocument });
  const reloadCount = useViewerStore(state => state.reloadCount);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollYRef = useDocumentScroll(iframeRef);
  const documentHtml = useDocumentHtml({
    ...(view.kind === "document"
      ? { handle: view.document.handle, fileName: view.document.fileName, root: view.folder.handle, path: view.path }
      : { handle: undefined, fileName: "", root: undefined, path: "" }),
    reloadCount,
    scrollYRef,
  });

  // 저장된 폴더를 불러오기 전에는 아무것도 그리지 않는다 — 「폴더 없음」 화면이 잠깐 비치지 않게
  if (view.kind === "restoring") return null;

  const center = (children: ReactNode) => <div className={CENTER_CLASS}>{children}</div>;

  // 목록이 접혀 있을 때만 빈 화면에 목록 열기 버튼을 둔다
  const openListButton = !isListVisible && <Button onClick={toggleList}>목록 열기</Button>;

  // 처음 쓰는 흐름(폴더 없음 · 문서 안 고름)에서만 도움말로 잇는다 — 결정 HP-A3
  const helpButton = (
    <Button
      variant="text"
      onClick={openHelp}
    >
      사용 방법 보기
    </Button>
  );

  if (view.kind === "unsupported") {
    return center(
      <EmptyState
        tone="muted"
        title="이 브라우저에서는 폴더를 열 수 없습니다"
        description="폴더 선택을 지원하는 브라우저에서 다시 열어 주세요."
      />,
    );
  }

  if (view.kind === "noFolder") {
    return center(
      <EmptyState
        title="등록된 폴더가 없습니다"
        description="HTML · MD 문서가 든 폴더를 추가하면 목록에 모아 보여 줍니다."
        actions={
          <>
            <Button
              variant="primary"
              icon={<FolderPlusIcon />}
              onClick={addFolder}
            >
              폴더 추가
            </Button>
            {helpButton}
          </>
        }
      />,
    );
  }

  if (view.kind === "noSelection") {
    return center(
      <EmptyState
        title="선택된 문서가 없습니다"
        description="목록에서 문서를 고르면 여기에 열립니다."
        actions={
          <>
            {openListButton}
            {helpButton}
          </>
        }
      />,
    );
  }

  if (view.kind === "disconnected") {
    return center(
      <EmptyState
        tone="muted"
        title="폴더 연결이 끊겼습니다"
        description="브라우저를 다시 열면 폴더 읽기 권한이 풀릴 수 있습니다. 다시 연결하면 목록이 돌아옵니다."
        actions={
          <>
            <Button
              variant="primary"
              onClick={() => reconnect(view.folderId)}
            >
              다시 연결
            </Button>
            {openListButton}
          </>
        }
      />,
    );
  }

  if (view.kind === "document" && documentHtml.status === "loading") return center(<Spinner />);

  if (view.kind === "document" && documentHtml.status === "ready") {
    // 문서는 권한을 좁힌 틀 안에서 연다 — 문서의 스크립트는 돌지만 이 앱의 저장소 · 화면에는 닿지 못한다.
    // 새로고침 중에는 보던 문서 위 가운데에 도는 표시를 겹친다(문서는 지우지 않는다, 결정 MD-A16)
    return (
      <div className="relative size-full">
        <iframe
          ref={iframeRef}
          title={view.document.name}
          srcDoc={withLinkGuard(documentHtml.html, documentHtml.restoreY)}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals allow-downloads"
          allow="clipboard-write"
          className="block size-full border-none"
        />
        {documentHtml.isReloading && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>
    );
  }

  // 고른 문서를 찾지 못했거나 읽지 못했다 — 「다시 시도」 는 그 폴더를 다시 훑는다
  const folderId = view.kind === "missing" ? view.folderId : selectedDocument?.folderId;

  return center(
    <EmptyState
      tone="muted"
      title="문서를 열 수 없습니다"
      description="파일이 옮겨졌거나 지워졌을 수 있습니다. 폴더 연결이 끊긴 경우에도 열리지 않습니다."
      actions={
        <>
          {folderId && (
            <Button
              variant="primary"
              onClick={() => refreshFolder(folderId)}
            >
              다시 시도
            </Button>
          )}
          {openListButton}
        </>
      }
    />,
  );
};

export default ViewerBody;
