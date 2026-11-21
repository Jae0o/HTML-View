import type { RegisteredFolder } from "../types";
import { filterFolders, findDocument, groupHtmlFiles, isExcludedDirectory, isHtmlFile } from "./folderTree";

import { describe, expect, it } from "vitest";

const file = (directories: string[], fileName: string) => ({ directories, fileName, handle: fileName });

describe("isExcludedDirectory", () => {
  it("점으로 시작하는 폴더와 의존성 폴더를 뺀다", () => {
    expect(isExcludedDirectory(".git")).toBe(true);
    expect(isExcludedDirectory("node_modules")).toBe(true);
    expect(isExcludedDirectory("completed")).toBe(false);
  });
});

describe("isHtmlFile", () => {
  it("html · htm 확장자를 대소문자 가리지 않고 받는다", () => {
    expect(isHtmlFile("기획.html")).toBe(true);
    expect(isHtmlFile("INDEX.HTM")).toBe(true);
    expect(isHtmlFile("기획.ai.md")).toBe(false);
  });
});

describe("groupHtmlFiles", () => {
  it("HTML 이 든 폴더만 남기고 경로를 「 / 」 로 잇는다", () => {
    const folders = groupHtmlFiles([
      file(["plan-a", "completed"], "결과.html"),
      file(["plan-a"], "README.md"),
      file(["notes"], "메모.txt"),
    ]);

    expect(folders).toEqual([
      { path: "plan-a / completed", documents: [{ name: "결과", fileName: "결과.html", handle: "결과.html" }] },
    ]);
  });

  it("등록 폴더 바로 아래 문서는 빈 경로로 묶이고 맨 앞에 온다", () => {
    const folders = groupHtmlFiles([file(["a"], "안.html"), file([], "밖.html")]);

    expect(folders.map(folder => folder.path)).toEqual(["", "a"]);
  });

  it("폴더와 문서를 이름순으로 놓고 숫자는 크기순으로 놓는다", () => {
    const folders = groupHtmlFiles([
      file(["010-b"], "문서 10.html"),
      file(["010-b"], "문서 2.html"),
      file(["002-a"], "가.html"),
    ]);

    expect(folders.map(folder => folder.path)).toEqual(["002-a", "010-b"]);
    expect(folders[1].documents.map(document => document.name)).toEqual(["문서 2", "문서 10"]);
  });

  it("확장자만 다른 문서는 이름이 같아도 파일 이름으로 따로 남는다", () => {
    const [folder] = groupHtmlFiles([file([], "a.html"), file([], "a.htm")]);

    expect(folder.documents.map(document => [document.name, document.fileName])).toEqual([
      ["a", "a.htm"],
      ["a", "a.html"],
    ]);
  });
});

describe("findDocument", () => {
  const document = { name: "결과", fileName: "결과.html", handle: "결과.html" };
  const folders = [
    { id: "a", name: "docs", status: "connected", htmlFolders: [{ path: "plan-a", documents: [document] }] },
  ] as unknown as RegisteredFolder[];

  it("등록 폴더 · 경로 · 파일 이름이 모두 맞는 문서를 찾는다", () => {
    expect(findDocument(folders, { folderId: "a", path: "plan-a", fileName: "결과.html" })).toEqual(document);
  });

  it("하나라도 다르면 찾지 못한다", () => {
    expect(findDocument(folders, { folderId: "b", path: "plan-a", fileName: "결과.html" })).toBeUndefined();
    expect(findDocument(folders, { folderId: "a", path: "plan-b", fileName: "결과.html" })).toBeUndefined();
    expect(findDocument(folders, { folderId: "a", path: "plan-a", fileName: "결과.htm" })).toBeUndefined();
  });
});

describe("filterFolders", () => {
  const entry = (name: string) => ({ name, fileName: `${name}.html`, handle: name });
  const folders = [
    {
      id: "a",
      name: "Docs",
      htmlFolders: [
        { path: "plan-a / completed", documents: [entry("결과 보고")] },
        { path: "notes", documents: [entry("회의 메모"), entry("Plan 초안")] },
      ],
    },
    { id: "b", name: "archive", htmlFolders: [{ path: "old", documents: [entry("개요")] }] },
  ] as unknown as RegisteredFolder[];

  // 결과를 [등록 폴더, [경로, 문서 이름들]…, 펼칠 경로] 모양으로 줄여 본다
  const summarize = (query: string) =>
    filterFolders(folders, query).map(({ folder, documentMatchedPaths }) => ({
      id: folder.id,
      htmlFolders: folder.htmlFolders.map(htmlFolder => [
        htmlFolder.path,
        htmlFolder.documents.map(document => document.name),
      ]),
      documentMatchedPaths,
    }));

  it("검색어가 비어 있으면 모든 등록 폴더를 그대로 돌려준다", () => {
    const matches = filterFolders(folders, "  ");

    expect(matches.map(match => match.folder)).toEqual(folders);
    expect(matches.every(match => match.documentMatchedPaths.length === 0)).toBe(true);
  });

  it("등록 폴더 이름이 맞으면 그 폴더를 통째로 남긴다 (대소문자 무관)", () => {
    const matches = filterFolders(folders, "docs");

    expect(matches).toEqual([{ folder: folders[0], documentMatchedPaths: [] }]);
  });

  it("경로가 맞는 HTML 폴더는 통째로, 문서 이름만 맞는 HTML 폴더는 그 문서만 남기고 펼칠 경로에 넣는다", () => {
    expect(summarize("PLAN")).toEqual([
      {
        id: "a",
        htmlFolders: [
          ["plan-a / completed", ["결과 보고"]],
          ["notes", ["Plan 초안"]],
        ],
        documentMatchedPaths: ["notes"],
      },
    ]);
  });

  it("문서 이름만으로도 찾는다", () => {
    expect(summarize("개요")).toEqual([{ id: "b", htmlFolders: [["old", ["개요"]]], documentMatchedPaths: ["old"] }]);
  });

  it("한글 자모가 풀려 저장된 이름도 찾는다", () => {
    const decomposed = [
      {
        id: "c",
        name: "문서함".normalize("NFD"),
        htmlFolders: [{ path: "", documents: [entry("회의록".normalize("NFD"))] }],
      },
    ] as unknown as RegisteredFolder[];

    expect(filterFolders(decomposed, "문서").map(match => match.folder.id)).toEqual(["c"]);
    expect(filterFolders(decomposed, "회의").map(match => match.documentMatchedPaths)).toEqual([[""]]);
  });

  it("맞는 것이 없으면 빈 목록이다", () => {
    expect(filterFolders(folders, "없는 이름")).toEqual([]);
  });
});
