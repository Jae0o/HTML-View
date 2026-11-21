import { VIEWER_STORAGE_KEY } from "./useViewerStore.constants";
import type { ViewerState } from "./useViewerStore.types";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useViewerStore = create<ViewerState>()(
  persist(
    set => ({
      isListOpen: true,
      isListDismissed: false,
      selectedDocument: null,
      // 목록이 보이면 접고, 안 보이면(접혔거나 잠깐 닫혔으면) 연다
      toggleList: () =>
        set(state =>
          state.isListOpen && !state.isListDismissed
            ? { isListOpen: false }
            : { isListOpen: true, isListDismissed: false },
        ),
      dismissList: () => set({ isListDismissed: true }),
      selectDocument: document => set({ selectedDocument: document, isListDismissed: true }),
    }),
    {
      name: VIEWER_STORAGE_KEY,
      partialize: state => ({ isListOpen: state.isListOpen, selectedDocument: state.selectedDocument }),
    },
  ),
);

export default useViewerStore;
