import type { ReadResult } from "./useDocumentHtml.types";
import { resolveDocumentHtml } from "./useDocumentHtml.utils";

import { describe, expect, it } from "vitest";

const A = { name: "a" } as unknown as FileSystemFileHandle;
const B = { name: "b" } as unknown as FileSystemFileHandle;
const ready: ReadResult = { handle: A, reloadCount: 0, html: "<p>a</p>", restoreY: 0 };

describe("resolveDocumentHtml", () => {
  it("문서가 없으면 error, 다른 문서의 결과뿐이면 읽는 중이다", () => {
    expect(resolveDocumentHtml(ready, undefined, 0)).toEqual({ status: "error" });
    expect(resolveDocumentHtml(null, A, 0)).toEqual({ status: "loading" });
    expect(resolveDocumentHtml(ready, B, 0)).toEqual({ status: "loading" });
  });

  it("같은 문서를 다시 읽는 중이면 보던 내용을 그대로 두고 isReloading 이다", () => {
    expect(resolveDocumentHtml(ready, A, 1)).toEqual({
      status: "ready",
      html: "<p>a</p>",
      isReloading: true,
      restoreY: 0,
    });
  });

  it("다시 읽기가 끝나면 되돌릴 높이를 함께 준다", () => {
    expect(resolveDocumentHtml({ ...ready, reloadCount: 1, restoreY: 640 }, A, 1)).toEqual({
      status: "ready",
      html: "<p>a</p>",
      isReloading: false,
      restoreY: 640,
    });
  });

  it("이전이 실패면 다시 읽는 동안은 읽는 중, 끝난 실패는 error 다", () => {
    const failed: ReadResult = { handle: A, reloadCount: 0, html: null, restoreY: 0 };

    expect(resolveDocumentHtml(failed, A, 1)).toEqual({ status: "loading" });
    expect(resolveDocumentHtml(failed, A, 0)).toEqual({ status: "error" });
  });
});
