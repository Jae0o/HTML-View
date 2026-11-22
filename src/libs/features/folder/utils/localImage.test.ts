import { inlineLocalImages, resolveRelativePath } from "./localImage";

import { describe, expect, it, vi } from "vitest";

describe("resolveRelativePath", () => {
  const directories = ["plan", "completed"];

  it("문서 폴더 기준으로 ./ · 하위 폴더 · ../ 를 푼다", () => {
    expect(resolveRelativePath(directories, "./a.png")).toEqual(["plan", "completed", "a.png"]);
    expect(resolveRelativePath(directories, "img/a.png")).toEqual(["plan", "completed", "img", "a.png"]);
    expect(resolveRelativePath(directories, "../a.png")).toEqual(["plan", "a.png"]);
  });

  it("등록 폴더 위로 벗어나면 null 이다", () => {
    expect(resolveRelativePath(directories, "../../../a.png")).toBeNull();
  });

  it("/ 로 시작하면 등록 폴더 맨 위 기준이고, %20 · ?쿼리를 푼다", () => {
    expect(resolveRelativePath(directories, "/root.png")).toEqual(["root.png"]);
    expect(resolveRelativePath(directories, "./화면%20캡처.png?v=2")).toEqual(["plan", "completed", "화면 캡처.png"]);
  });

  it("스킴이 있는 주소 · // · # · 빈 글자는 바꾸지 않는다", () => {
    expect(resolveRelativePath(directories, "https://example.com/a.png")).toBeNull();
    expect(resolveRelativePath(directories, "data:image/png;base64,AAAA")).toBeNull();
    expect(resolveRelativePath(directories, "//cdn/a.png")).toBeNull();
    expect(resolveRelativePath(directories, "#top")).toBeNull();
    expect(resolveRelativePath(directories, "")).toBeNull();
  });
});

describe("inlineLocalImages", () => {
  // 가짜 등록 폴더 — img/a.svg 하나가 있다
  const svg = new File(["<svg/>"], "a.svg", { type: "image/svg+xml" });
  const getFile = vi.fn(async () => svg);
  const root = {
    getDirectoryHandle: async (name: string) => {
      if (name !== "img") throw new Error("없음");
      return {
        getFileHandle: async (file: string) => (file === "a.svg" ? { getFile } : Promise.reject(new Error("없음"))),
      };
    },
  } as unknown as FileSystemDirectoryHandle;

  it("상대 경로 그림을 data URL 로 바꾸고, 같은 그림은 한 번만 읽는다", async () => {
    getFile.mockClear();
    const html = await inlineLocalImages('<img src="img/a.svg"><p>본문</p><img alt="x" src=\'img/a.svg\'>', {
      root,
      directories: [],
    });

    expect(html).toBe(
      `<img src="data:image/svg+xml;base64,${btoa("<svg/>")}"><p>본문</p><img alt="x" src='data:image/svg+xml;base64,${btoa("<svg/>")}'>`,
    );
    expect(getFile).toHaveBeenCalledTimes(1);
  });

  it("없는 그림 · 바깥 주소는 그대로 두고, 원본 글자(doctype)를 지킨다", async () => {
    const source = '<!doctype html><img src="img/none.png"><img src="https://example.com/a.png">';

    expect(await inlineLocalImages(source, { root, directories: [] })).toBe(source);
  });
});
