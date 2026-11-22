import { favoriteKey } from "../../utils";
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
      favorites: [],
      listView: "all",
      isHelpOpen: false,
      // 목록이 보이면 접고, 안 보이면(접혔거나 잠깐 닫혔으면) 연다
      toggleList: () =>
        set(state =>
          state.isListOpen && !state.isListDismissed
            ? { isListOpen: false }
            : { isListOpen: true, isListDismissed: false },
        ),
      dismissList: () => set({ isListDismissed: true }),
      selectDocument: document => set({ selectedDocument: document, isListDismissed: true }),
      closeDocument: () => set({ selectedDocument: null }),
      toggleFavorite: item =>
        set(state => {
          const key = favoriteKey(item);
          const rest = state.favorites.filter(favorite => favoriteKey(favorite) !== key);

          return { favorites: rest.length === state.favorites.length ? [...rest, item] : rest };
        }),
      removeFavoritesOfFolder: folderId =>
        set(state => ({ favorites: state.favorites.filter(favorite => favorite.folderId !== folderId) })),
      toggleListView: () => set(state => ({ listView: state.listView === "all" ? "favorites" : "all" })),
      openHelp: () => set({ isHelpOpen: true }),
      closeHelp: () => set({ isHelpOpen: false }),
    }),
    {
      name: VIEWER_STORAGE_KEY,
      partialize: state => ({
        isListOpen: state.isListOpen,
        selectedDocument: state.selectedDocument,
        favorites: state.favorites,
        listView: state.listView,
      }),
    },
  ),
);

export default useViewerStore;
