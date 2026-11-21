import { groupHtmlFiles, isExcludedDirectory, isHtmlFile } from "./folderTree";

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
