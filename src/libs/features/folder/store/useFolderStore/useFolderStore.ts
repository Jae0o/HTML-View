import { useToastStore } from "@libs/features/toast";

import type { FolderRecord, RegisteredFolder } from "../../types";
import { readFolderRecords, scanFolder, writeFolderRecord } from "../../utils";
import { FOLDER_MESSAGE } from "./useFolderStore.constants";
import type { FolderState } from "./useFolderStore.types";

import { create } from "zustand";

// 읽기 권한이 살아 있을 때만 훑는다. 권한이 풀렸거나 폴더가 없어졌으면 「연결 끊김」 으로 둔다
const readFolder = async ({
  id,
  name,
  handle,
}: Pick<FolderRecord, "id" | "name" | "handle">): Promise<RegisteredFolder> => {
  try {
    if ((await handle.queryPermission({ mode: "read" })) !== "granted") throw new Error("읽기 권한 없음");

    return { id, name, handle, status: "connected", htmlFolders: await scanFolder(handle) };
  } catch {
    return { id, name, handle, status: "disconnected", htmlFolders: [] };
  }
};

const isSameFolder = async (folders: RegisteredFolder[], handle: FileSystemDirectoryHandle): Promise<boolean> => {
  const results = await Promise.all(folders.map(folder => folder.handle.isSameEntry(handle)));

  return results.includes(true);
};

// 불러오기는 한 번만 한다 — 두 번 돌면 늦게 끝난 쪽이 그사이 추가한 폴더를 덮어쓴다 (개발 모드는 effect 를 두 번 부른다)
let hasRestoreStarted = false;

const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  isRestored: false,

  restore: async () => {
    if (hasRestoreStarted) return;
    hasRestoreStarted = true;

    try {
      const records = await readFolderRecords();

      set({ folders: await Promise.all(records.map(readFolder)) });
    } catch {
      useToastStore.getState().show(FOLDER_MESSAGE.restoreFailed);
    } finally {
      set({ isRestored: true });
    }
  },

  addFolder: async () => {
    let handle: FileSystemDirectoryHandle;

    try {
      handle = await window.showDirectoryPicker({ mode: "read" });
    } catch {
      // 선택 창을 그냥 닫은 경우 — 아무것도 하지 않는다
      return;
    }

    try {
      if (await isSameFolder(get().folders, handle)) {
        useToastStore.getState().show(FOLDER_MESSAGE.duplicated);
        return;
      }

      const record: FolderRecord = { id: crypto.randomUUID(), name: handle.name, handle, addedAt: Date.now() };

      await writeFolderRecord(record);
      const folder = await readFolder(record);

      set(state => ({ folders: [...state.folders, folder] }));
    } catch {
      useToastStore.getState().show(FOLDER_MESSAGE.addFailed);
    }
  },

  reconnect: async id => {
    const target = get().folders.find(folder => folder.id === id);
    if (!target) return;

    try {
      // 권한 요청을 거절하면 그대로 둔다
      if ((await target.handle.requestPermission({ mode: "read" })) !== "granted") return;

      const htmlFolders = await scanFolder(target.handle);

      set(state => ({
        folders: state.folders.map(folder =>
          folder.id === id ? { ...folder, status: "connected", htmlFolders } : folder,
        ),
      }));
    } catch {
      useToastStore.getState().show(FOLDER_MESSAGE.reconnectFailed);
    }
  },

  refreshFolder: async id => {
    const target = get().folders.find(folder => folder.id === id);
    if (!target) return;

    const refreshed = await readFolder(target);

    set(state => ({ folders: state.folders.map(folder => (folder.id === id ? refreshed : folder)) }));
  },
}));

export default useFolderStore;
