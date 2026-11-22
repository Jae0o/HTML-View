import type { DocumentFormat } from "@libs/features/folder";

import { favoriteKey } from "../../utils";
import { VIEWER_STORAGE_KEY } from "./useViewerStore.constants";
import type { ViewerState } from "./useViewerStore.types";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// 형식을 켜고 끌 때 이 순서로 다시 만든다
const FORMAT_ORDER: DocumentFormat[] = ["html", "md"];

const useViewerStore = create<ViewerState>()(
  persist(
    set => ({
      isListOpen: true,
      isListDismissed: false,
      selectedDocument: null,
      favorites: [],
      listView: "all",
      visibleFormats: ["html", "md"],
      reloadCount: 0,
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
      // 켜진 형식이 그 하나뿐이면 끄지 않는다 — 목록이 빈 채로 남지 않게 (결정 MD-A2)
      toggleFormat: format =>
        set(state => {
          const isOn = state.visibleFormats.includes(format);
          if (isOn && state.visibleFormats.length === 1) return {};

          return {
            visibleFormats: FORMAT_ORDER.filter(candidate =>
              candidate === format ? !isOn : state.visibleFormats.includes(candidate),
            ),
          };
        }),
      reloadDocument: () => set(state => ({ reloadCount: state.reloadCount + 1 })),
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
        visibleFormats: state.visibleFormats,
      }),
    },
  ),
);

export default useViewerStore;
