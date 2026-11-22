// MD 문서를 넣는 문서 틀의 스타일 — 결정 MD-A8 · A9 · 확인 CK-D4 (2026-11-22).
// 문서 틀은 앱 CSS 변수를 읽지 못해 색은 0Docs 토큰과 같은 값을 적고, 옆 주석에 토큰 이름을 단다.
// 단위는 rem — html 을 62.5% 로 둬 1rem = 10px
export const MARKDOWN_STYLE = `
html { font-size: 62.5%; }
body { margin: 0; background: #ffffff; /* bg-canvas */ }
.md {
  box-sizing: border-box;
  max-width: 72rem;
  margin: 0 auto;
  /* 위 6.4rem — 왼쪽 위 떠 있는 버튼(위 12 + 테두리 1 + 안쪽 12 + 버튼 32 = 57px) 아래에서 시작 */
  padding: 6.4rem 1.6rem 16rem;
  font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI",
    "Malgun Gothic", sans-serif;
  font-size: 1.5rem;
  line-height: 2.6rem;
  color: #09090b; /* text-primary */
  word-wrap: break-word;
}
.md h1, .md h2, .md h3, .md h4, .md h5, .md h6 { font-weight: 700; margin: 3.2rem 0 1.6rem; }
.md h1 { font-size: 2.8rem; line-height: 3.6rem; margin-top: 0; padding-bottom: 1.2rem; border-bottom: 0.1rem solid #e4e4e7; /* border-default */ }
.md h2 { font-size: 2.2rem; line-height: 3rem; margin-top: 4rem; padding-bottom: 0.8rem; border-bottom: 0.1rem solid #ececee; /* border-subtle */ }
.md h3 { font-size: 1.8rem; line-height: 2.6rem; }
.md h4, .md h5, .md h6 { font-size: 1.5rem; line-height: 2.6rem; }
.md p, .md ul, .md ol, .md blockquote, .md table, .md pre, .md dl { margin: 0 0 1.6rem; }
.md ul, .md ol { padding-left: 2.4rem; }
.md li + li { margin-top: 0.4rem; }
.md li > input[type="checkbox"] { margin: 0 0.8rem 0 0; pointer-events: none; }
.md a { color: #047857; /* text-brand */ }
.md hr { border: 0; border-top: 0.1rem solid #e4e4e7; /* border-default */ margin: 2.4rem 0; }
.md img { max-width: 100%; }
.md blockquote { padding: 0 1.6rem; border-left: 0.4rem solid #d1fae5; /* brand-bg-muted */ color: #52525b; /* text-secondary */ }
.md code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 1.3rem; background: #f4f4f5; /* surface-hover */ border-radius: 0.4rem; padding: 0.1rem 0.6rem; }
.md pre { background: #fafafa; /* bg-subtle */ border: 0.1rem solid #ececee; /* border-subtle */ border-radius: 0.6rem; padding: 1.6rem; overflow-x: auto; line-height: 2rem; }
.md pre code { background: none; padding: 0; border-radius: 0; }
.md table { display: block; overflow-x: auto; border-collapse: collapse; font-size: 1.4rem; line-height: 2.2rem; }
.md th, .md td { border: 0.1rem solid #e4e4e7; /* border-default */ padding: 0.6rem 1.2rem; text-align: left; }
.md th { background: #fafafa; /* bg-subtle */ font-weight: 600; }
.md .front-matter { display: grid; grid-template-columns: auto 1fr; gap: 0.4rem 1.6rem; padding: 1.2rem 1.6rem; margin: 0 0 2.4rem; border: 0.1rem solid #ececee; /* border-subtle */ border-radius: 0.6rem; background: #fafafa; /* bg-subtle */ font-size: 1.3rem; line-height: 2rem; color: #52525b; /* text-secondary */ }
.md .front-matter dt { font-weight: 600; color: #09090b; /* text-primary */ }
.md .front-matter dd { margin: 0; white-space: pre-wrap; }
.md .footnotes { margin-top: 4rem; padding-top: 1.6rem; border-top: 0.1rem solid #e4e4e7; /* border-default */ font-size: 1.3rem; line-height: 2rem; color: #52525b; /* text-secondary */ }
.md .sr-only { position: absolute; width: 0.1rem; height: 0.1rem; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

.md .mermaid { margin: 0 0 1.6rem; text-align: center; overflow-x: auto; }
.md .mermaid svg { max-width: 100%; height: auto; }
.md math[display="block"] { margin: 0 0 1.6rem; overflow-x: auto; }
.md pre code.hljs { padding: 0; background: none; }
`;
