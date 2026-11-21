import { useEffect } from "react";

import { useFolderStore } from "@libs/features/folder";

/** 등록 폴더를 다시 확인하는 간격 — 10초 */
const REFRESH_INTERVAL_MS = 10_000;

/** 10초마다 등록 폴더를 다시 훑어 새로 생긴 문서를 목록에 반영한다. 화면을 보고 있지 않을 때(다른 탭)는 건너뛴다 */
const useFolderAutoRefresh = () => {
  const refreshFolders = useFolderStore(state => state.refreshFolders);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshFolders();
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [refreshFolders]);
};

export default useFolderAutoRefresh;
