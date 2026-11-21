/** loading 읽는 중 · ready 읽음 · error 문서를 찾지 못했거나 읽지 못함 */
export type DocumentHtml = { status: "loading" } | { status: "ready"; html: string } | { status: "error" };
