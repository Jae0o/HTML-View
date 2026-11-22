import { splitFrontMatter } from "./frontMatter";

import { describe, expect, it } from "vitest";

describe("splitFrontMatter", () => {
  it("머리말이 없으면 전부 본문이다", () => {
    expect(splitFrontMatter("# 제목\n본문")).toEqual({ entries: [], body: "# 제목\n본문" });
  });

  it("맨 앞 --- 사이의 「이름: 값」 을 떼어 내고 나머지를 본문으로 둔다", () => {
    expect(splitFrontMatter("---\nname: folder-hide\ndescription: 숨기기\n---\n# 제목")).toEqual({
      entries: [
        ["name", "folder-hide"],
        ["description", "숨기기"],
      ],
      body: "# 제목",
    });
  });

  it("닫는 --- 가 없으면 머리말이 아니다", () => {
    const text = "---\nname: a\n# 제목";

    expect(splitFrontMatter(text)).toEqual({ entries: [], body: text });
  });

  it("들여 쓴 줄 · 목록 줄은 앞 항목 값에 줄바꿈으로 붙고, \\r\\n 도 받는다", () => {
    expect(splitFrontMatter("---\r\npaths:\r\n  - src/**/*.ts\r\n  - src/**/*.tsx\r\n---\r\n본문")).toEqual({
      entries: [["paths", "- src/**/*.ts\n- src/**/*.tsx"]],
      body: "본문",
    });
  });

  it("사이에 「이름: 값」 이 아닌 줄이 있으면 구분선으로 시작하는 본문으로 본다", () => {
    const text = "---\n그냥 문장입니다.\n---\n아래 본문";

    expect(splitFrontMatter(text)).toEqual({ entries: [], body: text });
  });
});
