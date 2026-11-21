import { VIEWER_STORAGE_KEY } from "./useViewerStore.constants";
import type { ViewerState } from "./useViewerStore.types";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useViewerStore = create<ViewerState>()(
  persist(
    set => ({
      isListOpen: true,
      toggleList: () => set(state => ({ isListOpen: !state.isListOpen })),
    }),
    {
      name: VIEWER_STORAGE_KEY,
      partialize: state => ({ isListOpen: state.isListOpen }),
    },
  ),
);

export default useViewerStore;
