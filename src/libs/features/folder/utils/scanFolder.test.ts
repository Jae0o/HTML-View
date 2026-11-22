import { scanFolder } from "./scanFolder";

import { describe, expect, it } from "vitest";

interface FakeEntry {
  kind: "file" | "directory";
  name: string;
  values?: () => AsyncGenerator<FakeEntry>;
}

const fakeFile = (name: string): FakeEntry => ({ kind: "file", name });

const fakeDirectory = (name: string, children: FakeEntry[]): FakeEntry => ({
  kind: "directory",
  name,
  values: async function* () {
    yield* children;
  },
});

describe("scanFolder", () => {
  it("아래 폴더까지 훑고, 점(.) 폴더도 훑되 제외 폴더 안은 보지 않는다", async () => {
    const root = fakeDirectory("docs", [
      fakeFile("개요.html"),
      fakeDirectory("plan-a", [fakeDirectory("completed", [fakeFile("결과.html")])]),
      fakeDirectory(".claude", [fakeDirectory("docs", [fakeFile("플랜.html")])]),
      fakeDirectory("node_modules", [fakeFile("숨은 문서.html")]),
      fakeDirectory(".git", [fakeFile("숨은 문서.html")]),
      fakeDirectory(".venv", [fakeFile("숨은 문서.html")]),
    ]);

    const folders = await scanFolder(root as unknown as FileSystemDirectoryHandle);

    expect(folders.map(folder => [folder.path, folder.documents.map(document => document.name)])).toEqual([
      ["", ["개요"]],
      [".claude / docs", ["플랜"]],
      ["plan-a / completed", ["결과"]],
    ]);
  });
});
