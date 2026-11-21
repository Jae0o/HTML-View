/** 즐겨찾기 한 개 — folder 등록 폴더 · htmlFolder HTML 폴더 · document 문서 */
export type FavoriteItem =
  | { kind: "folder"; folderId: string }
  | { kind: "htmlFolder"; folderId: string; path: string }
  | { kind: "document"; folderId: string; path: string; fileName: string };

/** 목록 보기 — all 전체 · favorites 즐겨찾기만 */
export type ListView = "all" | "favorites";
