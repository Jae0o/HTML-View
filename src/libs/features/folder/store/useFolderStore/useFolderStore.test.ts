import { useToastStore } from "@libs/features/toast";

import type { FolderRecord, RegisteredFolder } from "../../types";
import { readFolderRecords, scanFolder, writeFolderRecord } from "../../utils";
import useFolderStore from "./useFolderStore";
import { FOLDER_MESSAGE } from "./useFolderStore.constants";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// 기기 저장 · 폴더 훑기는 브라우저 기능이라 가짜로 바꾼다
vi.mock("../../utils", () => ({
  readFolderRecords: vi.fn(),
  writeFolderRecord: vi.fn(),
  scanFolder: vi.fn(),
}));

interface FakeHandle {
  name: string;
  queryPermission: () => Promise<PermissionState>;
  requestPermission: () => Promise<PermissionState>;
  isSameEntry: (other: unknown) => Promise<boolean>;
}

// 가짜 폴더 연결 — 읽기 권한 상태만 정한다
const fakeHandle = (name: string, permission: PermissionState = "granted"): FakeHandle => {
  const handle: FakeHandle = {
    name,
    queryPermission: async () => permission,
    requestPermission: async () => permission,
    isSameEntry: async other => other === handle,
  };

  return handle;
};

const asRecord = (id: string, handle: FakeHandle, addedAt: number) =>
  ({ id, name: handle.name, handle, addedAt }) as unknown as FolderRecord;

const asFolder = (id: string, handle: FakeHandle, status: RegisteredFolder["status"]) =>
  ({ id, name: handle.name, handle, status, htmlFolders: [] }) as unknown as RegisteredFolder;

const pick = (handle: FakeHandle | Error) =>
  vi.stubGlobal("window", {
    showDirectoryPicker: async () => {
      if (handle instanceof Error) throw handle;

      return handle;
    },
  });

describe("useFolderStore", () => {
  beforeEach(() => {
    vi.mocked(scanFolder).mockResolvedValue([]);
    vi.mocked(writeFolderRecord).mockResolvedValue();
    useFolderStore.setState({ folders: [], isRestored: false });
    useToastStore.getState().hide();
  });

  afterEach(() => {
    useToastStore.getState().hide();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("restore 는 읽기 권한이 있는 폴더만 훑고, 없는 폴더는 연결 끊김으로 둔다", async () => {
    vi.mocked(readFolderRecords).mockResolvedValue([
      asRecord("a", fakeHandle("docs"), 1),
      asRecord("b", fakeHandle("moved", "prompt"), 2),
    ]);

    await useFolderStore.getState().restore();

    expect(useFolderStore.getState().isRestored).toBe(true);
    expect(useFolderStore.getState().folders.map(folder => [folder.name, folder.status])).toEqual([
      ["docs", "connected"],
      ["moved", "disconnected"],
    ]);
    expect(scanFolder).toHaveBeenCalledTimes(1);
  });

  it("addFolder 는 고른 폴더를 기기에 저장하고 목록 끝에 더한다", async () => {
    pick(fakeHandle("docs"));

    await useFolderStore.getState().addFolder();

    expect(writeFolderRecord).toHaveBeenCalledTimes(1);
    expect(useFolderStore.getState().folders.map(folder => [folder.name, folder.status])).toEqual([
      ["docs", "connected"],
    ]);
  });

  it("이미 등록된 폴더를 고르면 더하지 않고 알린다", async () => {
    const handle = fakeHandle("docs");

    useFolderStore.setState({ folders: [asFolder("a", handle, "connected")] });
    pick(handle);

    await useFolderStore.getState().addFolder();

    expect(useFolderStore.getState().folders).toHaveLength(1);
    expect(writeFolderRecord).not.toHaveBeenCalled();
    expect(useToastStore.getState().message).toBe(FOLDER_MESSAGE.duplicated);
  });

  it("폴더 선택 창을 그냥 닫으면 아무것도 하지 않는다", async () => {
    pick(new Error("닫음"));

    await useFolderStore.getState().addFolder();

    expect(useFolderStore.getState().folders).toEqual([]);
    expect(useToastStore.getState().message).toBeNull();
  });
});
