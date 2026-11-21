import { VIEWER_STORAGE_KEY } from "./useViewerStore.constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

// 테스트 환경에는 브라우저 저장소가 없다 — 같은 모양의 메모리 저장소를 끼운다 (스토어는 window.localStorage 를 읽는다)
const memory = new Map<string, string>();

vi.stubGlobal("window", {
  localStorage: {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => memory.set(key, value),
    removeItem: (key: string) => memory.delete(key),
  },
});

// 스토어는 만들어질 때 저장소를 읽는다 — 저장소를 끼운 뒤에 불러온다
const { default: useViewerStore } = await import("./useViewerStore");

const readSaved = () => JSON.parse(memory.get(VIEWER_STORAGE_KEY) ?? "{}").state;

const DOCUMENT = { folderId: "a", path: "plan-a", fileName: "결과.html" };

describe("useViewerStore", () => {
  beforeEach(() => {
    useViewerStore.setState({
      isListOpen: true,
      isListDismissed: false,
      selectedDocument: null,
      favorites: [],
      listView: "all",
    });
  });

  it("목록은 처음에 열려 있다", () => {
    expect(useViewerStore.getState().isListOpen).toBe(true);
  });

  it("toggleList 로 접고 열며 그 상태를 기기에 기억한다", () => {
    useViewerStore.getState().toggleList();
    expect(useViewerStore.getState().isListOpen).toBe(false);
    expect(readSaved().isListOpen).toBe(false);

    useViewerStore.getState().toggleList();
    expect(useViewerStore.getState().isListOpen).toBe(true);
    expect(readSaved().isListOpen).toBe(true);
  });

  it("문서를 고르면 목록이 잠깐 닫히고, 잠깐 닫힌 상태는 기기에 기억하지 않는다", () => {
    useViewerStore.getState().selectDocument(DOCUMENT);

    expect(useViewerStore.getState().isListDismissed).toBe(true);
    expect(readSaved()).toEqual({ isListOpen: true, selectedDocument: DOCUMENT, favorites: [], listView: "all" });
  });

  it("잠깐 닫힌 목록에서 toggleList 를 부르면 다시 연다", () => {
    useViewerStore.getState().dismissList();
    useViewerStore.getState().toggleList();

    expect(useViewerStore.getState()).toMatchObject({ isListOpen: true, isListDismissed: false });
  });

  it("toggleFavorite 는 켠 순서대로 쌓고, 다시 부르면 뺀다", () => {
    const folder = { kind: "folder", folderId: "a" } as const;
    const document = { kind: "document", ...DOCUMENT } as const;

    useViewerStore.getState().toggleFavorite(folder);
    useViewerStore.getState().toggleFavorite(document);
    expect(useViewerStore.getState().favorites).toEqual([folder, document]);
    expect(readSaved().favorites).toEqual([folder, document]);

    useViewerStore.getState().toggleFavorite({ kind: "folder", folderId: "a" });
    expect(useViewerStore.getState().favorites).toEqual([document]);
  });

  it("removeFavoritesOfFolder 는 그 등록 폴더와 안쪽 항목의 즐겨찾기만 지운다", () => {
    const kept = { kind: "folder", folderId: "b" } as const;

    useViewerStore.setState({
      favorites: [{ kind: "folder", folderId: "a" }, { kind: "document", ...DOCUMENT }, kept],
    });
    useViewerStore.getState().removeFavoritesOfFolder("a");

    expect(useViewerStore.getState().favorites).toEqual([kept]);
  });

  it("toggleListView 로 전체 · 즐겨찾기 보기를 바꾸고 기기에 기억한다", () => {
    useViewerStore.getState().toggleListView();
    expect(useViewerStore.getState().listView).toBe("favorites");
    expect(readSaved().listView).toBe("favorites");

    useViewerStore.getState().toggleListView();
    expect(useViewerStore.getState().listView).toBe("all");
  });
});
