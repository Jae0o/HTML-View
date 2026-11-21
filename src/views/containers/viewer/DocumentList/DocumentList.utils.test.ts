import type { RegisteredFolder } from "@libs/features/folder";
import type { ResolvedFavorite } from "@libs/features/viewer";

import { favoriteLabel, filterFavorites } from "./DocumentList.utils";

import { describe, expect, it } from "vitest";

const document = { name: "결과 보고", fileName: "결과 보고.html", handle: {} as FileSystemFileHandle };
const folder = { id: "a", name: "Docs", status: "connected", htmlFolders: [] } as unknown as RegisteredFolder;

const favorites: ResolvedFavorite[] = [
  { item: { kind: "folder", folderId: "a" }, kind: "folder", folder },
  {
    item: { kind: "htmlFolder", folderId: "a", path: "plan-a" },
    kind: "htmlFolder",
    folder,
    htmlFolder: { path: "plan-a", documents: [document] },
  },
  {
    item: { kind: "htmlFolder", folderId: "a", path: "" },
    kind: "htmlFolder",
    folder,
    htmlFolder: { path: "", documents: [] },
  },
  {
    item: { kind: "document", folderId: "a", path: "plan-a", fileName: "결과 보고.html" },
    kind: "document",
    folder,
    path: "plan-a",
    document,
  },
];

describe("favoriteLabel", () => {
  it("등록 폴더는 이름, HTML 폴더는 「등록 폴더 / 경로」, 문서는 문서 이름이다", () => {
    expect(favorites.map(favoriteLabel)).toEqual(["Docs", "Docs / plan-a", "Docs / 최상위", "결과 보고"]);
  });
});

describe("filterFavorites", () => {
  it("줄 이름으로 거르고 문서 이름도 본다 (대소문자 무관)", () => {
    expect(filterFavorites(favorites, "PLAN").map(favoriteLabel)).toEqual(["Docs / plan-a"]);
    expect(filterFavorites(favorites, "보고").map(favoriteLabel)).toEqual(["결과 보고"]);
    expect(filterFavorites(favorites, " ")).toBe(favorites);
  });
});
