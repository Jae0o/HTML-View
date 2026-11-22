import { useToastStore } from "@libs/features/toast";

import type { FolderRecord, RegisteredFolder } from "../../types";
import {
  deleteFolderRecord,
  readFolderRecords,
  renameFolderRecord,
  scanFolder,
  writeFolderRecord,
  writeHiddenPaths,
} from "../../utils";
import useFolderStore from "./useFolderStore";
import { FOLDER_MESSAGE } from "./useFolderStore.constants";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// 기기 저장 · 폴더 훑기는 브라우저 기능이라 가짜로 바꾼다. 목록을 합치는 계산(mergeHtmlFolders)은 진짜를 쓴다
vi.mock("../../utils/folderDb", () => ({
  readFolderRecords: vi.fn(),
  writeFolderRecord: vi.fn(),
  deleteFolderRecord: vi.fn(),
  renameFolderRecord: vi.fn(),
  writeHiddenPaths: vi.fn(),
}));
vi.mock("../../utils/scanFolder", () => ({ scanFolder: vi.fn() }));

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
  ({ id, name: handle.name, handle, status, htmlFolders: [], hiddenPaths: [] }) as unknown as RegisteredFolder;

const htmlFolder = (path: string) => ({
  path,
  documents: [{ name: "문서", fileName: "문서.html", handle: {} as FileSystemFileHandle }],
});

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
    vi.mocked(deleteFolderRecord).mockResolvedValue();
    vi.mocked(renameFolderRecord).mockResolvedValue();
    vi.mocked(writeHiddenPaths).mockResolvedValue();
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

  it("reconnect 는 읽기 권한을 받으면 다시 훑어 연결됨으로 바꾼다", async () => {
    useFolderStore.setState({ folders: [asFolder("a", fakeHandle("docs", "granted"), "disconnected")] });

    await useFolderStore.getState().reconnect("a");

    expect(useFolderStore.getState().folders[0].status).toBe("connected");
    expect(scanFolder).toHaveBeenCalledTimes(1);
  });

  it("reconnect 에서 권한을 거절하면 연결 끊김 그대로 둔다", async () => {
    useFolderStore.setState({ folders: [asFolder("a", fakeHandle("docs", "denied"), "disconnected")] });

    await useFolderStore.getState().reconnect("a");

    expect(useFolderStore.getState().folders[0].status).toBe("disconnected");
    expect(scanFolder).not.toHaveBeenCalled();
  });

  it("refreshFolder 는 다시 훑은 결과로 바꾼다", async () => {
    const documents = [{ name: "새 문서", fileName: "새 문서.html", handle: {} as FileSystemFileHandle }];

    useFolderStore.setState({ folders: [asFolder("a", fakeHandle("docs"), "connected")] });
    vi.mocked(scanFolder).mockResolvedValue([{ path: "", documents }]);

    await useFolderStore.getState().refreshFolder("a");

    expect(useFolderStore.getState().folders[0].htmlFolders).toEqual([{ path: "", documents }]);
  });

  it("refreshFolder 에서 읽기 권한이 풀려 있으면 연결 끊김으로 바꾼다", async () => {
    useFolderStore.setState({ folders: [asFolder("a", fakeHandle("docs", "prompt"), "connected")] });

    await useFolderStore.getState().refreshFolder("a");

    expect(useFolderStore.getState().folders[0].status).toBe("disconnected");
    expect(scanFolder).not.toHaveBeenCalled();
  });

  it("removeFolder 는 기기에 저장한 연결을 지우고 목록에서 뺀다", async () => {
    useFolderStore.setState({
      folders: [asFolder("a", fakeHandle("docs"), "connected"), asFolder("b", fakeHandle("notes"), "connected")],
    });

    expect(await useFolderStore.getState().removeFolder("a")).toBe(true);
    expect(deleteFolderRecord).toHaveBeenCalledWith("a");
    expect(useFolderStore.getState().folders.map(folder => folder.id)).toEqual(["b"]);
  });

  it("removeFolder 가 기기에서 지우지 못하면 목록을 그대로 두고 알린다", async () => {
    useFolderStore.setState({ folders: [asFolder("a", fakeHandle("docs"), "connected")] });
    vi.mocked(deleteFolderRecord).mockRejectedValue(new Error("지우기 실패"));

    expect(await useFolderStore.getState().removeFolder("a")).toBe(false);
    expect(useFolderStore.getState().folders).toHaveLength(1);
    expect(useToastStore.getState().message).toBe(FOLDER_MESSAGE.removeFailed);
  });

  it("renameFolder 는 앞뒤 빈칸을 뺀 이름을 기기에 저장하고 목록 이름을 바꾼다", async () => {
    useFolderStore.setState({ folders: [asFolder("a", fakeHandle("docs"), "connected")] });

    await useFolderStore.getState().renameFolder("a", "  기획 문서함 ");

    expect(renameFolderRecord).toHaveBeenCalledWith("a", "기획 문서함");
    expect(useFolderStore.getState().folders[0].name).toBe("기획 문서함");
  });

  it("renameFolder 에 빈 이름을 주면 실제 폴더 이름으로 되돌린다", async () => {
    useFolderStore.setState({ folders: [{ ...asFolder("a", fakeHandle("docs"), "connected"), name: "기획 문서함" }] });

    await useFolderStore.getState().renameFolder("a", "   ");

    expect(renameFolderRecord).toHaveBeenCalledWith("a", "docs");
    expect(useFolderStore.getState().folders[0].name).toBe("docs");
  });

  it("renameFolder 에 지금과 같은 이름을 주면 저장하지 않는다", async () => {
    const folders = [asFolder("a", fakeHandle("docs"), "connected")];
    useFolderStore.setState({ folders });

    await useFolderStore.getState().renameFolder("a", "docs");

    expect(renameFolderRecord).not.toHaveBeenCalled();
    expect(useFolderStore.getState().folders).toBe(folders);
  });

  it("renameFolder 가 기기에 저장하지 못하면 이름을 그대로 두고 알린다", async () => {
    useFolderStore.setState({ folders: [asFolder("a", fakeHandle("docs"), "connected")] });
    vi.mocked(renameFolderRecord).mockRejectedValue(new Error("저장 실패"));

    await useFolderStore.getState().renameFolder("a", "기획 문서함");

    expect(useFolderStore.getState().folders[0].name).toBe("docs");
    expect(useToastStore.getState().message).toBe(FOLDER_MESSAGE.renameFailed);
  });

  it("refreshFolder 는 숨긴 폴더를 빼고 보여 준다", async () => {
    useFolderStore.setState({
      folders: [{ ...asFolder("a", fakeHandle("docs"), "connected"), hiddenPaths: ["done"] }],
    });
    vi.mocked(scanFolder).mockResolvedValue([htmlFolder("done / features-1"), htmlFolder("help-modal")]);

    await useFolderStore.getState().refreshFolder("a");

    expect(useFolderStore.getState().folders[0].htmlFolders.map(folder => folder.path)).toEqual(["help-modal"]);
    expect(useFolderStore.getState().folders[0].hiddenPaths).toEqual(["done"]);
  });

  it("숨긴 경로가 없는 기록(새로 추가 · 숨기기 전에 저장한 기록)은 숨긴 것이 없다", async () => {
    pick(fakeHandle("docs"));

    await useFolderStore.getState().addFolder();

    expect(useFolderStore.getState().folders[0].hiddenPaths).toEqual([]);
  });

  it("hidePath 는 숨긴 경로를 기기에 저장하고, 그 폴더와 아래 폴더를 목록에서 빼고 알린다", async () => {
    useFolderStore.setState({
      folders: [
        {
          ...asFolder("a", fakeHandle("docs"), "connected"),
          htmlFolders: [htmlFolder("done / features-1"), htmlFolder("done / features-2"), htmlFolder("help-modal")],
        },
      ],
    });

    expect(await useFolderStore.getState().hidePath("a", "done")).toBe(true);
    expect(writeHiddenPaths).toHaveBeenCalledWith("a", ["done"]);

    const [folder] = useFolderStore.getState().folders;

    expect(folder.hiddenPaths).toEqual(["done"]);
    expect(folder.htmlFolders.map(htmlFolder => htmlFolder.path)).toEqual(["help-modal"]);
    expect(useToastStore.getState().message).toBe(FOLDER_MESSAGE.hidden);
  });

  it("hidePath 로 위 폴더를 숨기면 그 아래를 따로 숨겨 둔 경로는 정리한다", async () => {
    useFolderStore.setState({
      folders: [{ ...asFolder("a", fakeHandle("docs"), "connected"), hiddenPaths: ["done / features-1", "done-old"] }],
    });

    await useFolderStore.getState().hidePath("a", "done");

    expect(useFolderStore.getState().folders[0].hiddenPaths).toEqual(["done-old", "done"]);
    expect(writeHiddenPaths).toHaveBeenCalledWith("a", ["done-old", "done"]);
  });

  it("hidePath 가 기기에 저장하지 못하면 목록을 그대로 두고 알린다", async () => {
    const folders = [{ ...asFolder("a", fakeHandle("docs"), "connected"), htmlFolders: [htmlFolder("done")] }];
    useFolderStore.setState({ folders });
    vi.mocked(writeHiddenPaths).mockRejectedValue(new Error("저장 실패"));

    expect(await useFolderStore.getState().hidePath("a", "done")).toBe(false);
    expect(useFolderStore.getState().folders).toBe(folders);
    expect(useToastStore.getState().message).toBe(FOLDER_MESSAGE.hideFailed);
  });

  it("showPath 는 숨긴 경로를 기기에서 빼고 다시 훑어 그 폴더를 되돌린다", async () => {
    useFolderStore.setState({
      folders: [
        {
          ...asFolder("a", fakeHandle("docs"), "connected"),
          htmlFolders: [htmlFolder("help-modal")],
          hiddenPaths: ["done", ".storybook"],
        },
      ],
    });
    vi.mocked(scanFolder).mockResolvedValue([
      htmlFolder(".storybook"),
      htmlFolder("done / features-1"),
      htmlFolder("help-modal"),
    ]);

    await useFolderStore.getState().showPath("a", "done");

    const [folder] = useFolderStore.getState().folders;

    expect(writeHiddenPaths).toHaveBeenCalledWith("a", [".storybook"]);
    expect(folder.hiddenPaths).toEqual([".storybook"]);
    expect(folder.htmlFolders.map(htmlFolder => htmlFolder.path)).toEqual(["done / features-1", "help-modal"]);
  });

  it("showPath 는 연결이 끊긴 폴더면 숨긴 경로만 바꾸고 다시 훑지 않는다", async () => {
    useFolderStore.setState({
      folders: [{ ...asFolder("a", fakeHandle("docs"), "disconnected"), hiddenPaths: ["done"] }],
    });

    await useFolderStore.getState().showPath("a", "done");

    expect(useFolderStore.getState().folders[0].hiddenPaths).toEqual([]);
    expect(scanFolder).not.toHaveBeenCalled();
  });

  it("showPath 를 이어 누르면 둘 다 다시 보인다 — 저장하자마자 숨긴 경로를 바꿔, 다음 누름이 옛 목록으로 저장하지 않는다", async () => {
    useFolderStore.setState({
      folders: [{ ...asFolder("a", fakeHandle("docs"), "connected"), hiddenPaths: ["done", ".storybook"] }],
    });
    let finishScan: (value: never[]) => void = () => {};
    vi.mocked(scanFolder).mockImplementationOnce(() => new Promise(resolve => (finishScan = resolve)));

    const first = useFolderStore.getState().showPath("a", "done");
    await vi.waitFor(() => expect(useFolderStore.getState().folders[0].hiddenPaths).toEqual([".storybook"]));
    await useFolderStore.getState().showPath("a", ".storybook");
    finishScan([]);
    await first;

    expect(useFolderStore.getState().folders[0].hiddenPaths).toEqual([]);
    expect(writeHiddenPaths).toHaveBeenLastCalledWith("a", []);
  });

  it("showPath 가 기기에 저장하지 못하면 숨긴 채로 두고 알린다", async () => {
    const folders = [{ ...asFolder("a", fakeHandle("docs"), "connected"), hiddenPaths: ["done"] }];
    useFolderStore.setState({ folders });
    vi.mocked(writeHiddenPaths).mockRejectedValue(new Error("저장 실패"));

    await useFolderStore.getState().showPath("a", "done");

    expect(useFolderStore.getState().folders).toBe(folders);
    expect(scanFolder).not.toHaveBeenCalled();
    expect(useToastStore.getState().message).toBe(FOLDER_MESSAGE.showFailed);
  });

  it("refreshFolders 는 다시 훑어도 숨긴 폴더를 빼 둔다 — 숨긴 폴더 아래에 새로 생긴 폴더도", async () => {
    useFolderStore.setState({
      folders: [
        {
          ...asFolder("a", fakeHandle("docs"), "connected"),
          htmlFolders: [htmlFolder("help-modal")],
          hiddenPaths: ["done"],
        },
      ],
    });
    vi.mocked(scanFolder).mockResolvedValue([htmlFolder("done / new-plan"), htmlFolder("help-modal")]);

    await useFolderStore.getState().refreshFolders();

    expect(useFolderStore.getState().folders[0].htmlFolders.map(folder => folder.path)).toEqual(["help-modal"]);
  });

  it("refreshFolders 는 새로 생긴 문서를 반영하고, 바뀐 것이 없는 폴더는 그대로 둔다", async () => {
    const changing = asFolder("a", fakeHandle("docs"), "connected");
    const steady = asFolder("b", fakeHandle("notes"), "connected");
    const documents = [{ name: "새 문서", fileName: "새 문서.html", handle: {} as FileSystemFileHandle }];

    useFolderStore.setState({ folders: [changing, steady] });
    vi.mocked(scanFolder).mockImplementation(async handle =>
      handle === changing.handle ? [{ path: "", documents }] : [],
    );

    await useFolderStore.getState().refreshFolders();

    const [first, second] = useFolderStore.getState().folders;

    expect(first.htmlFolders).toEqual([{ path: "", documents }]);
    expect(second).toBe(steady);
  });

  it("refreshFolders 에서 바뀐 것이 없으면 목록을 건드리지 않는다", async () => {
    const folders = [asFolder("a", fakeHandle("docs"), "connected")];

    useFolderStore.setState({ folders });
    await useFolderStore.getState().refreshFolders();

    expect(useFolderStore.getState().folders).toBe(folders);
  });

  it("refreshFolders 는 권한이 풀린 폴더를 연결 끊김으로 바꾸고, 이미 끊긴 폴더는 건너뛴다", async () => {
    useFolderStore.setState({
      folders: [
        asFolder("a", fakeHandle("docs", "prompt"), "connected"),
        asFolder("b", fakeHandle("lost"), "disconnected"),
      ],
    });

    await useFolderStore.getState().refreshFolders();

    expect(useFolderStore.getState().folders.map(folder => folder.status)).toEqual(["disconnected", "disconnected"]);
    expect(scanFolder).not.toHaveBeenCalled();
  });

  it("refreshFolders 는 훑다가 오류가 나면 그 폴더를 그대로 둔다", async () => {
    const folders = [asFolder("a", fakeHandle("docs"), "connected")];
    useFolderStore.setState({ folders });
    vi.mocked(scanFolder).mockRejectedValue(new Error("읽는 중 사라짐"));

    await useFolderStore.getState().refreshFolders();

    expect(useFolderStore.getState().folders).toBe(folders);
  });

  it("refreshFolders 는 훑는 동안 바뀐 폴더를 옛 결과로 덮지 않는다", async () => {
    const handle = fakeHandle("docs");
    const replaced = asFolder("a", handle, "connected");
    useFolderStore.setState({ folders: [asFolder("a", handle, "connected")] });
    vi.mocked(scanFolder).mockImplementation(async () => {
      useFolderStore.setState({ folders: [replaced] });

      return [{ path: "", documents: [{ name: "신규", fileName: "신규.html", handle: {} as FileSystemFileHandle }] }];
    });

    await useFolderStore.getState().refreshFolders();

    expect(useFolderStore.getState().folders[0]).toBe(replaced);
  });
});
