import { copyDocumentText, downloadDocument } from "./DocumentActions.utils";

import { afterEach, describe, expect, it, vi } from "vitest";

const HTML = "<h1>보고서</h1>";

// 가짜 문서 파일 연결 — 읽으면 위 HTML 이 든 파일이 나온다
const fakeHandle = (file: File) => ({ getFile: async () => file }) as unknown as FileSystemFileHandle;

describe("downloadDocument", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("원래 파일 이름으로 내려받고, 그 뒤 임시 주소를 푼다", async () => {
    vi.useFakeTimers();
    const link = { href: "", download: "", click: vi.fn() };
    vi.stubGlobal("document", { createElement: () => link });
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:sample");
    const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    await downloadDocument(fakeHandle(new File([HTML], "보고서.html")));

    expect(link).toMatchObject({ href: "blob:sample", download: "보고서.html" });
    expect(link.click).toHaveBeenCalledTimes(1);
    expect(revoke).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(revoke).toHaveBeenCalledWith("blob:sample");
  });
});

describe("copyDocumentText", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("파일 원문 글자를 그대로 클립보드에 넣는다", async () => {
    const writeText = vi.fn(async () => {});
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    await copyDocumentText(fakeHandle(new File(["# 제목\n\n- [x] 끝"], "플랜.md")));

    expect(writeText).toHaveBeenCalledWith("# 제목\n\n- [x] 끝");
  });
});
