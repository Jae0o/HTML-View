import type { DocumentHtml, ReadResult } from "./useDocumentHtml.types";

/**
 * 마지막 읽기 결과와 지금 문서 · 다시 읽기 횟수로 보여 줄 상태를 정한다 (결정 MD-A16 · A17).
 * 다른 문서이거나 이전이 실패면 읽는 중, 같은 문서를 다시 읽는 중이면 보던 내용을 그대로 둔다
 */
export const resolveDocumentHtml = (
  result: ReadResult | null,
  handle: FileSystemFileHandle | undefined,
  reloadCount: number,
): DocumentHtml => {
  if (!handle) return { status: "error" };
  if (!result || result.handle !== handle) return { status: "loading" };

  const isReloading = result.reloadCount !== reloadCount;

  if (result.html === null) return isReloading ? { status: "loading" } : { status: "error" };

  return { status: "ready", html: result.html, isReloading, restoreY: result.restoreY };
};
