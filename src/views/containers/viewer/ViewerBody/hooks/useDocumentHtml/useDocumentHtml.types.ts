/**
 * loading 읽는 중 · ready 읽음 · error 문서를 찾지 못했거나 읽지 못함.
 * ready 의 isReloading 은 같은 문서를 다시 읽는 중(보던 내용은 그대로), restoreY 는 다시 그린 뒤 되돌릴 스크롤 높이
 */
export type DocumentHtml =
  | { status: "loading" }
  | { status: "ready"; html: string; isReloading: boolean; restoreY: number }
  | { status: "error" };

/** 마지막으로 끝난 읽기 */
export interface ReadResult {
  handle: FileSystemFileHandle;
  /** 이 읽기를 시작했을 때의 다시 읽기 횟수 */
  reloadCount: number;
  /** 읽지 못했으면 null */
  html: string | null;
  restoreY: number;
}
