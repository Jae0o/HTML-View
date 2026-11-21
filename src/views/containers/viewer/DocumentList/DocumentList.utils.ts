import { toSearchText } from "@libs/features/folder";
import type { ResolvedFavorite } from "@libs/features/viewer";

import { ROOT_FOLDER_LABEL } from "./DocumentList.constants";

/** 즐겨찾기 보기에서 쓰는 줄 이름 — 등록 폴더는 이름, HTML 폴더는 「등록 폴더 / 경로」, 문서는 문서 이름 */
export const favoriteLabel = (favorite: ResolvedFavorite): string => {
  if (favorite.kind === "folder") return favorite.folder.name;
  if (favorite.kind === "document") return favorite.document.name;

  return `${favorite.folder.name} / ${favorite.htmlFolder.path || ROOT_FOLDER_LABEL}`;
};

/** 즐겨찾기를 줄 이름으로 거른다 (대소문자 · 한글 자모 풀림을 가리지 않는다) — 문서 이름도 본다 */
export const filterFavorites = (favorites: ResolvedFavorite[], query: string): ResolvedFavorite[] => {
  const keyword = toSearchText(query.trim());
  if (!keyword) return favorites;

  return favorites.filter(favorite => toSearchText(favoriteLabel(favorite)).includes(keyword));
};
