import { useToastStore } from "@libs/features/toast";

import type { FolderRecord, RegisteredFolder } from "../../types";
import {
  deleteFolderRecord,
  isHiddenPath,
  mergeHtmlFolders,
  readFolderRecords,
  removeHiddenFolders,
  renameFolderRecord,
  scanFolder,
  writeFolderRecord,
  writeHiddenPaths,
} from "../../utils";
import { FOLDER_MESSAGE } from "./useFolderStore.constants";
import type { FolderState } from "./useFolderStore.types";

import { create } from "zustand";

// 읽기 권한이 살아 있을 때만 훑는다. 권한이 풀렸거나 폴더가 없어졌으면 「연결 끊김」 으로 둔다. 숨긴 폴더는 뺀다
const readFolder = async ({
  id,
  name,
  handle,
  hiddenPaths = [],
}: Pick<FolderRecord, "id" | "name" | "handle" | "hiddenPaths">): Promise<RegisteredFolder> => {
  try {
    if ((await handle.queryPermission({ mode: "read" })) !== "granted") throw new Error("읽기 권한 없음");

    const htmlFolders = removeHiddenFolders(await scanFolder(handle), hiddenPaths);

    return { id, name, handle, status: "connected", htmlFolders, hiddenPaths };
  } catch {
    return { id, name, handle, status: "disconnected", htmlFolders: [], hiddenPaths };
  }
};

const isSameFolder = async (folders: RegisteredFolder[], handle: FileSystemDirectoryHandle): Promise<boolean> => {
  const results = await Promise.all(folders.map(folder => folder.handle.isSameEntry(handle)));

  return results.includes(true);
};

// 연결된 폴더 하나를 다시 훑는다 — 바뀐 것이 없으면 받은 객체를 그대로 돌려준다
const rescanFolder = async (folder: RegisteredFolder): Promise<RegisteredFolder> => {
  try {
    if ((await folder.handle.queryPermission({ mode: "read" })) !== "granted") {
      return { ...folder, status: "disconnected", htmlFolders: [] };
    }

    const htmlFolders = mergeHtmlFolders(
      folder.htmlFolders,
      removeHiddenFolders(await scanFolder(folder.handle), folder.hiddenPaths),
    );

    return htmlFolders === folder.htmlFolders ? folder : { ...folder, htmlFolders };
  } catch {
    // 훑다가 난 오류(파일을 쓰는 중 · 하위 폴더가 옮겨짐)는 연결 끊김이 아니다 — 그대로 두고 다음 차례에 다시 본다
    return folder;
  }
};

// 다시 훑기가 겹치지 않게 한다 — 폴더가 커서 한 번이 5초를 넘겨도 다음 차례는 건너뛴다
let isRefreshing = false;

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

      const htmlFolders = removeHiddenFolders(await scanFolder(target.handle), target.hiddenPaths);

      set(state => ({
        folders: state.folders.map(folder =>
          folder.id === id ? { ...folder, status: "connected", htmlFolders } : folder,
        ),
      }));
    } catch {
      useToastStore.getState().show(FOLDER_MESSAGE.reconnectFailed);
    }
  },

  removeFolder: async id => {
    try {
      await deleteFolderRecord(id);

      set(state => ({ folders: state.folders.filter(folder => folder.id !== id) }));

      return true;
    } catch {
      useToastStore.getState().show(FOLDER_MESSAGE.removeFailed);

      return false;
    }
  },

  renameFolder: async (id, name) => {
    const target = get().folders.find(folder => folder.id === id);
    if (!target) return;

    // 비우면 실제 폴더 이름(폴더 연결이 늘 알고 있다)으로 되돌린다
    const nextName = name.trim() || target.handle.name;
    if (nextName === target.name) return;

    try {
      await renameFolderRecord(id, nextName);

      set(state => ({
        folders: state.folders.map(folder => (folder.id === id ? { ...folder, name: nextName } : folder)),
      }));
    } catch {
      useToastStore.getState().show(FOLDER_MESSAGE.renameFailed);
    }
  },

  hidePath: async (id, path) => {
    const target = get().folders.find(folder => folder.id === id);
    if (!target) return false;

    // 이 폴더 아래를 이미 숨겨 둔 경로는 정리한다 — 이 폴더를 다시 보이게 할 때 아래가 숨은 채 남지 않게
    const hiddenPaths = [...target.hiddenPaths.filter(hidden => !isHiddenPath(hidden, [path])), path];

    try {
      await writeHiddenPaths(id, hiddenPaths);

      set(state => ({
        folders: state.folders.map(folder =>
          folder.id === id
            ? { ...folder, hiddenPaths, htmlFolders: removeHiddenFolders(folder.htmlFolders, [path]) }
            : folder,
        ),
      }));
      useToastStore.getState().show(FOLDER_MESSAGE.hidden);

      return true;
    } catch {
      useToastStore.getState().show(FOLDER_MESSAGE.hideFailed);

      return false;
    }
  },

  showPath: async (id, path) => {
    const target = get().folders.find(folder => folder.id === id);
    if (!target) return;

    const hiddenPaths = target.hiddenPaths.filter(hidden => hidden !== path);

    try {
      await writeHiddenPaths(id, hiddenPaths);
    } catch {
      useToastStore.getState().show(FOLDER_MESSAGE.showFailed);
      return;
    }

    // 숨긴 경로는 저장하자마자 바꾼다 — 다시 훑기는 몇 초 걸릴 수 있어, 그동안 숨긴 폴더 창의 줄이 남아 있으면 이어 누른 「다시 보이기」 가 옛 목록으로 저장한다
    set(state => ({
      folders: state.folders.map(folder => (folder.id === id ? { ...folder, hiddenPaths } : folder)),
    }));

    // 숨긴 폴더는 목록에 없으니 다시 훑어야 돌아온다 — 연결이 끊긴 폴더는 다시 연결할 때 훑는다
    const updated = get().folders.find(folder => folder.id === id);
    if (!updated || updated.status !== "connected") return;

    const rescanned = await rescanFolder(updated);

    // 훑는 동안 그 폴더가 그대로일 때만 바꾼다 — 그사이 다른 폴더를 다시 보이게 했으면 그쪽 훑기 결과가 맞다
    set(state => ({ folders: state.folders.map(folder => (folder === updated ? rescanned : folder)) }));
  },

  refreshFolders: async () => {
    if (isRefreshing) return;
    isRefreshing = true;

    try {
      const connected = get().folders.filter(folder => folder.status === "connected");
      const rescanned = await Promise.all(connected.map(rescanFolder));
      const changed = new Map(
        connected.flatMap((folder, index) =>
          rescanned[index] === folder ? [] : [[folder, rescanned[index]] as const],
        ),
      );

      // 바뀐 폴더가 없으면 목록을 건드리지 않는다 — 화면을 다시 그리지 않는다
      if (changed.size === 0) return;

      // 훑기 시작할 때의 폴더 그대로일 때만 바꾼다 — 그사이 추가 · 해제 · 다시 연결 · 다시 시도로 바뀐 폴더를 옛 결과로 덮지 않는다
      set(state => ({ folders: state.folders.map(folder => changed.get(folder) ?? folder) }));
    } finally {
      isRefreshing = false;
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
