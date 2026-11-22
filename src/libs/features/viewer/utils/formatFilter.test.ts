import type { RegisteredFolder } from "@libs/features/folder";

import { filterFoldersByFormat } from "./formatFilter";

import { describe, expect, it } from "vitest";

const entry = (fileName: string) => ({ name: fileName.replace(/\.[^.]+$/, ""), fileName, handle: fileName });

const FOLDERS = [
  {
    id: "a",
    name: "docs",
    status: "connected",
    hiddenPaths: [],
    htmlFolders: [
      { path: "html-only", documents: [entry("결과.html")] },
      { path: "mixed", documents: [entry("기획.html"), entry("기획.ai.md")] },
      { path: "md-only", documents: [entry("README.md")] },
    ],
  },
  {
    id: "b",
    name: "html-box",
    status: "connected",
    hiddenPaths: [],
    htmlFolders: [{ path: "", documents: [entry("a.htm")] }],
  },
] as unknown as RegisteredFolder[];

describe("filterFoldersByFormat", () => {
  it("두 형식이 다 켜져 있으면 받은 배열을 그대로 돌려준다", () => {
    expect(filterFoldersByFormat(FOLDERS, ["html", "md"])).toBe(FOLDERS);
  });

  it("MD 만 켜면 HTML 만 든 문서 폴더는 빠지고, 섞인 폴더는 MD 문서만 남는다", () => {
    const [docs] = filterFoldersByFormat(FOLDERS, ["md"]);

    expect(docs.htmlFolders.map(folder => [folder.path, folder.documents.map(document => document.fileName)])).toEqual([
      ["mixed", ["기획.ai.md"]],
      ["md-only", ["README.md"]],
    ]);
  });

  it("문서가 0 이 된 등록 폴더도 목록에는 남는다", () => {
    const [, htmlBox] = filterFoldersByFormat(FOLDERS, ["md"]);

    expect(htmlBox.id).toBe("b");
    expect(htmlBox.htmlFolders).toEqual([]);
  });
});
