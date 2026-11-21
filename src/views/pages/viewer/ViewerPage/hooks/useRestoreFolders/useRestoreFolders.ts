import { useEffect } from "react";

import { isFolderPickerSupported, useFolderStore } from "@libs/features/folder";

/** 화면이 열릴 때 기기에 저장된 등록 폴더를 불러온다 */
const useRestoreFolders = () => {
  const restore = useFolderStore(state => state.restore);

  useEffect(() => {
    if (isFolderPickerSupported()) void restore();
  }, [restore]);
};

export default useRestoreFolders;
