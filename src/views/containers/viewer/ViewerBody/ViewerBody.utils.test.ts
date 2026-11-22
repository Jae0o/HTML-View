import type { RegisteredFolder } from "@libs/features/folder";

import { resolveBodyView, withLinkGuard } from "./ViewerBody.utils";

import { describe, expect, it } from "vitest";

describe("withLinkGuard", () => {
  it("문서 내용은 그대로 두고 맨 뒤에 링크 지킴 · 스크롤 보고 스크립트를 붙인다", () => {
    const html = "<h1>문서</h1>";
    const guarded = withLinkGuard(html);

    expect(guarded.startsWith(html)).toBe(true);
    expect(guarded.slice(html.length).match(/<script>/g)).toHaveLength(2);
    expect(guarded).toContain('parent.postMessage({source:"0docs",scrollY:scrollY},"*")');
  });

  it("되돌릴 높이를 주면 다 읽은 뒤 그 높이로 가는 스크립트를 붙이고, 0 이면 붙이지 않는다", () => {
    expect(withLinkGuard("<p>a</p>", 640.4)).toContain("scrollTo(0,640)");
    expect(withLinkGuard("<p>a</p>", 0)).not.toContain("scrollTo");
  });
});

describe("resolveBodyView", () => {
  const document = { name: "결과", fileName: "결과.html", handle: "결과.html" };
  const folder = (id: string, status: RegisteredFolder["status"]) =>
    ({
      id,
      name: id,
      status,
      htmlFolders: status === "connected" ? [{ path: "plan-a", documents: [document] }] : [],
    }) as unknown as RegisteredFolder;
  const selected = { folderId: "a", path: "plan-a", fileName: "결과.html" };
  const base = { isSupported: true, isRestored: true, folders: [folder("a", "connected")], selectedDocument: null };

  it("폴더를 열 수 없는 브라우저 · 불러오는 중이 가장 먼저다", () => {
    expect(resolveBodyView({ ...base, isSupported: false }).kind).toBe("unsupported");
    expect(resolveBodyView({ ...base, isRestored: false }).kind).toBe("restoring");
  });

  it("고른 문서를 찾으면 문서, 못 찾으면 missing 이다", () => {
    expect(resolveBodyView({ ...base, selectedDocument: selected })).toEqual({
      kind: "document",
      document,
      folder: base.folders[0],
      path: "plan-a",
    });
    expect(resolveBodyView({ ...base, selectedDocument: { ...selected, fileName: "없음.html" } })).toEqual({
      kind: "missing",
      folderId: "a",
    });
  });

  it("고른 문서의 폴더가 연결 끊김이면 그 폴더를 다시 연결하게 한다", () => {
    const folders = [folder("b", "connected"), folder("a", "disconnected")];

    expect(resolveBodyView({ ...base, folders, selectedDocument: selected })).toEqual({
      kind: "disconnected",
      folderId: "a",
    });
  });

  it("고른 문서의 폴더가 등록 해제됐으면 고르지 않은 것으로 본다", () => {
    expect(resolveBodyView({ ...base, selectedDocument: { ...selected, folderId: "gone" } }).kind).toBe("noSelection");
  });

  it("문서를 고르지 않았을 때 — 폴더 없음 · 전부 끊김 · 고르라는 안내 순이다", () => {
    expect(resolveBodyView({ ...base, folders: [] }).kind).toBe("noFolder");
    expect(resolveBodyView({ ...base, folders: [folder("a", "disconnected"), folder("b", "disconnected")] })).toEqual({
      kind: "disconnected",
      folderId: "a",
    });
    expect(resolveBodyView({ ...base, folders: [folder("a", "disconnected"), folder("b", "connected")] }).kind).toBe(
      "noSelection",
    );
  });
});
