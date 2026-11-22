import { renderMarkdown } from "./renderMarkdown";

import { describe, expect, it } from "vitest";

describe("renderMarkdown", () => {
  it("문서 전체를 돌려주고 본문을 읽기 칸에 넣는다", async () => {
    const html = await renderMarkdown("본문");

    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain('<main class="md"><p>본문</p>');
  });

  it("제목에 id 를 붙인다 — 문서 안 제목 이동", async () => {
    expect(await renderMarkdown("## 태스크 분해")).toContain('<h2 id="태스크-분해">');
  });

  it("표 · 체크리스트 · 취소선을 그린다", async () => {
    const html = await renderMarkdown("| a | b |\n| --- | --- |\n| 1 | 2 |\n\n- [x] 끝\n- [ ] 남음\n\n~~지움~~");

    expect(html).toContain("<table>");
    expect(html).toContain('type="checkbox"');
    expect(html).toContain("<del>지움</del>");
  });

  it("각주를 각주 영역으로 모으고 제목을 「각주」 로 둔다", async () => {
    const html = await renderMarkdown("본문[^1]\n\n[^1]: 설명");

    expect(html).toContain('href="#footnote-1"');
    expect(html).toContain('class="footnotes"');
    expect(html).toContain(">각주</h2>");
  });

  it("머리말을 이름-값 상자로 그리고 이름 · 값을 이스케이프한다", async () => {
    const html = await renderMarkdown('---\nname: <b>x</b>\nnote: "<script>"\n---\n본문');

    expect(html).toContain('<dl class="front-matter"><dt>name</dt><dd>&lt;b&gt;x&lt;/b&gt;</dd>');
    expect(html).toContain("&quot;&lt;script&gt;&quot;");
    expect(html).not.toContain("<script>");
  });

  // 테마 스타일(?inline CSS)은 테스트 환경에서 빈 글자라 단언하지 않는다 — 빌드 결과로 본다
  it("언어 이름이 붙은 코드 블록을 언어별로 색칠한다", async () => {
    const html = await renderMarkdown("```ts\nconst a = 1\n```");

    expect(html).toContain('<code class="hljs language-ts">');
    expect(html).toContain('<span class="hljs-keyword">const</span>');
  });

  it("수식을 MathML 로 그린다", async () => {
    expect(await renderMarkdown("넓이는 $x^2$ 입니다")).toContain("<math");
  });

  it("Mermaid 를 그리지 못하면 그 블록만 원문 코드로 남기고 나머지 본문은 정상으로 바꾼다", async () => {
    const html = await renderMarkdown("# 흐름\n\n```mermaid\ngraph TD; A-->B\n```\n\n```ts\nconst a = 1\n```");

    expect(html).toContain("<pre><code>graph TD; A--&gt;B</code></pre>");
    expect(html).toContain('<h1 id="흐름">흐름</h1>');
    expect(html).toContain('<span class="hljs-keyword">const</span>');
    expect(html).not.toContain('data-mermaid="0"');
  });
});
