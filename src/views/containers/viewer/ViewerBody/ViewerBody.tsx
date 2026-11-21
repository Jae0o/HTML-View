import { isFolderPickerSupported, useFolderStore } from "@libs/features/folder";

import { Button, EmptyState } from "@views/components/common";
import { FolderPlusIcon } from "@views/components/icons";

// 빈 화면 · 안내 화면을 본문 가운데에 두는 칸
const CENTER_CLASS = "flex h-full items-center justify-center p-24";

/** 본문 — 지금 상태에 맞는 화면 하나를 보여 준다 */
const ViewerBody = () => {
  const isRestored = useFolderStore(state => state.isRestored);
  const hasFolder = useFolderStore(state => state.folders.length > 0);
  const addFolder = useFolderStore(state => state.addFolder);

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

  return (
    <div className={CENTER_CLASS}>
      <EmptyState
        title="선택된 문서가 없습니다"
        description="목록에서 문서를 고르면 여기에 열립니다."
      />
    </div>
  );
};

export default ViewerBody;
