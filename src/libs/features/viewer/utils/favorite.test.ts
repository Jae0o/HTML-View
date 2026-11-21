import type { RegisteredFolder } from "@libs/features/folder";

import type { FavoriteItem } from "../types";
import { favoriteKey, resolveFavorites } from "./favorite";

import { describe, expect, it } from "vitest";

const document = { name: "결과", fileName: "결과.html", handle: "결과.html" };
const htmlFolder = { path: "plan-a", documents: [document] };
const folder = { id: "a", name: "docs", status: "connected", htmlFolders: [htmlFolder] } as unknown as RegisteredFolder;

describe("favoriteKey", () => {
  it("대상이 같으면 같은 값, 종류나 자리가 다르면 다른 값이다", () => {
    const folderItem: FavoriteItem = { kind: "folder", folderId: "a" };
    const htmlFolderItem: FavoriteItem = { kind: "htmlFolder", folderId: "a", path: "plan-a" };

    expect(favoriteKey(folderItem)).toBe(favoriteKey({ kind: "folder", folderId: "a" }));
    expect(favoriteKey(folderItem)).not.toBe(favoriteKey(htmlFolderItem));
    expect(favoriteKey(htmlFolderItem)).not.toBe(favoriteKey({ ...htmlFolderItem, path: "plan-b" }));
  });
});

describe("resolveFavorites", () => {
  it("켠 순서 그대로 등록 폴더 · HTML 폴더 · 문서에 잇는다", () => {
    const resolved = resolveFavorites(
      [
        { kind: "document", folderId: "a", path: "plan-a", fileName: "결과.html" },
        { kind: "folder", folderId: "a" },
        { kind: "htmlFolder", folderId: "a", path: "plan-a" },
      ],
      [folder],
    );

    expect(resolved.map(favorite => favorite.kind)).toEqual(["document", "folder", "htmlFolder"]);
    expect(resolved[0]).toMatchObject({ folder, path: "plan-a", document });
    expect(resolved[2]).toMatchObject({ folder, htmlFolder });
  });

  it("지금 목록에서 찾을 수 없는 즐겨찾기는 뺀다", () => {
    const resolved = resolveFavorites(
      [
        { kind: "folder", folderId: "gone" },
        { kind: "htmlFolder", folderId: "a", path: "plan-b" },
        { kind: "document", folderId: "a", path: "plan-a", fileName: "없음.html" },
      ],
      [folder],
    );

    expect(resolved).toEqual([]);
  });
});
