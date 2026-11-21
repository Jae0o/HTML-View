import type { DocumentEntry, HtmlFolder, RegisteredFolder } from "@libs/features/folder";

import type { FavoriteItem } from "../types";

/** 즐겨찾기 한 개를 가리는 글자 — 같은 대상이면 같은 값이다 */
export const favoriteKey = (item: FavoriteItem): string =>
  [
    item.kind,
    item.folderId,
    item.kind === "folder" ? "" : item.path,
    item.kind === "document" ? item.fileName : "",
  ].join("\n");

/** 즐겨찾기와 그것이 가리키는 실제 대상 */
export type ResolvedFavorite =
  | { item: FavoriteItem; kind: "folder"; folder: RegisteredFolder }
  | { item: FavoriteItem; kind: "htmlFolder"; folder: RegisteredFolder; htmlFolder: HtmlFolder }
  | { item: FavoriteItem; kind: "document"; folder: RegisteredFolder; path: string; document: DocumentEntry };

/** 즐겨찾기를 켠 순서대로 실제 대상에 잇는다 — 지금 목록에서 찾을 수 없는 것(옮겨짐 · 지워짐 · 연결 끊김)은 뺀다 */
export const resolveFavorites = (favorites: FavoriteItem[], folders: RegisteredFolder[]): ResolvedFavorite[] =>
  favorites.flatMap((item): ResolvedFavorite[] => {
    const folder = folders.find(candidate => candidate.id === item.folderId);
    if (!folder) return [];
    if (item.kind === "folder") return [{ item, kind: "folder", folder }];

    const htmlFolder = folder.htmlFolders.find(candidate => candidate.path === item.path);
    if (!htmlFolder) return [];
    if (item.kind === "htmlFolder") return [{ item, kind: "htmlFolder", folder, htmlFolder }];

    const document = htmlFolder.documents.find(candidate => candidate.fileName === item.fileName);

    return document ? [{ item, kind: "document", folder, path: item.path, document }] : [];
  });
