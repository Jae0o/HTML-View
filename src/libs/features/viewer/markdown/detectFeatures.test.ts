import { detectFeatures } from "./detectFeatures";

import { describe, expect, it } from "vitest";

describe("detectFeatures", () => {
  it("언어 이름이 붙은 코드 블록이 있으면 코드 색칠이 필요하다", () => {
    expect(detectFeatures("```ts\nconst a = 1\n```").code).toBe(true);
    expect(detectFeatures("~~~py\nprint(1)\n~~~").code).toBe(true);
  });

  it("언어 없는 코드 블록 · 코드 없는 문서는 색칠이 필요 없다", () => {
    expect(detectFeatures("```\n글자\n```\n본문")).toEqual({ code: false, mermaid: false, math: false });
  });

  it("mermaid 블록만 있으면 그림만 필요하다", () => {
    expect(detectFeatures("```mermaid\ngraph TD; A-->B\n```")).toEqual({ code: false, mermaid: true, math: false });
  });

  it("$ 가 있으면 수식 부품을 받는다", () => {
    expect(detectFeatures("넓이는 $x^2$ 입니다").math).toBe(true);
  });
});
