import { detectFeatures } from "./detectFeatures";
import { splitFrontMatter } from "./frontMatter";
import { MARKDOWN_STYLE } from "./markdownStyle";

import { Marked, type MarkedExtension, type Tokens } from "marked";
import markedFootnote from "marked-footnote";
import { gfmHeadingId } from "marked-gfm-heading-id";

const escapeHtml = (text: string): string =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const renderFrontMatter = (entries: [string, string][]): string =>
  entries.length === 0
    ? ""
    : `<dl class="front-matter">${entries.map(([name, value]) => `<dt>${escapeHtml(name)}</dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl>`;

/** 필요할 때만 받는다 — 받지 못하면 그 기능만 빼고 계속한다(null) */
const loadIf = <T>(isNeeded: boolean, load: () => Promise<T>): Promise<T | null> =>
  isNeeded ? load().catch(() => null) : Promise.resolve(null);

const MERMAID_PLACEHOLDER = /<div class="mermaid" data-mermaid="(\d+)"><\/div>/g;

/** 코드 블록의 언어 이름 — 정보 글자의 첫 낱말 */
const languageOf = (token: Tokens.Code): string => (token.lang ?? "").split(/\s/)[0].toLowerCase();

/** Mermaid 자리를 SVG 로 바꾼다. 받기 · 준비 실패면 모든 자리를, 그리기 실패면 그 자리를 원문 코드 블록으로 둔다 */
const renderMermaid = async (html: string, sources: string[]): Promise<string> => {
  if (sources.length === 0) return html;

  const fallback = (source: string) => `<pre><code>${escapeHtml(source)}</code></pre>`;
  const svgs = sources.map(fallback);

  try {
    const { default: mermaid } = await import("mermaid");
    mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });

    // 하나씩 그린다 — Mermaid 는 그리는 동안 화면에 잠깐 쓰는 요소를 둔다
    for (const [index, source] of sources.entries()) {
      try {
        svgs[index] = (await mermaid.render(`mermaid-${index}-${Date.now()}`, source)).svg;
      } catch {
        svgs[index] = fallback(source);
      }
    }
  } catch {
    // 받기 · 준비 실패 — 원문 코드 블록 그대로
  }

  return html.replace(MERMAID_PLACEHOLDER, (_, index: string) => svgs[Number(index)]);
};

/**
 * MD 글자를 문서 틀에 넣을 HTML 문서 전체로 바꾼다 (결정 MD-A7 · A10 · A11).
 * GFM(표 · 체크리스트 · 취소선 · 자동 링크) · 각주 · 제목 id · 머리말 상자 · 언어별 코드 색칠 · Mermaid · 수식.
 * 코드 색칠 · Mermaid · 수식 부품은 그 내용이 있을 때만 받는다. MD 안 HTML 은 그대로 둔다 — 문서 틀이 가둔다
 */
export const renderMarkdown = async (text: string): Promise<string> => {
  const { entries, body } = splitFrontMatter(text);
  const features = detectFeatures(body);

  const [highlight, highlightTheme, katex] = await Promise.all([
    loadIf(features.code, () => Promise.all([import("highlight.js"), import("marked-highlight")])),
    loadIf(features.code, () => import("highlight.js/styles/github.css?inline")),
    loadIf(features.math, () => import("marked-katex-extension")),
  ]);

  // 부를 때마다 새 인스턴스 — 전역 설정을 바꾸지 않는다
  const extensions: MarkedExtension[] = [markedFootnote({ description: "각주" }), gfmHeadingId()];

  if (highlight) {
    const [{ default: hljs }, { markedHighlight }] = highlight;
    extensions.push(
      markedHighlight({
        langPrefix: "hljs language-",
        highlight: (code, lang) => {
          const language = lang.split(/\s/)[0].toLowerCase();
          // 언어 없는 블록 · Mermaid 는 색칠하지 않는다
          if (!language || language === "mermaid") return code;

          return hljs.highlight(code, { language: hljs.getLanguage(language) ? language : "plaintext" }).value;
        },
      }),
    );
  }

  if (katex) extensions.push(katex.default({ throwOnError: false, output: "mathml" }));

  // Mermaid 자리 — 색칠 확장 뒤에 붙여야 이 렌더러가 먼저 돈다
  const mermaidSources: string[] = [];
  if (features.mermaid) {
    extensions.push({
      renderer: {
        code(token) {
          if (languageOf(token) !== "mermaid") return false;

          mermaidSources.push(token.text);
          return `<div class="mermaid" data-mermaid="${mermaidSources.length - 1}"></div>`;
        },
      },
    });
  }

  const marked = new Marked(...extensions);
  const html = await renderMermaid(await marked.parse(body, { gfm: true, breaks: false }), mermaidSources);
  const style = highlightTheme ? `${MARKDOWN_STYLE}${highlightTheme.default}` : MARKDOWN_STYLE;

  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${style}</style></head><body><main class="md">${renderFrontMatter(entries)}${html}</main></body></html>`;
};
