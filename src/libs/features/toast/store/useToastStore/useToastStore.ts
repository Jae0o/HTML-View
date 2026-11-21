import { TOAST_DURATION_MS } from "./useToastStore.constants";
import type { ToastState } from "./useToastStore.types";

import { create } from "zustand";

let timer: ReturnType<typeof setTimeout> | undefined;

const useToastStore = create<ToastState>(set => ({
  message: null,
  show: message => {
    clearTimeout(timer);
    set({ message });
    timer = setTimeout(() => set({ message: null }), TOAST_DURATION_MS);
  },
  hide: () => {
    clearTimeout(timer);
    set({ message: null });
  },
}));

export default useToastStore;
