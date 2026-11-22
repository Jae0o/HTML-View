/** 문서에 든 것 — 그 부품을 받을지 정한다 (결정 MD-A10) */
export interface MarkdownFeatures {
  /** 언어 이름이 붙은 코드 블록 (mermaid 제외) */
  code: boolean;
  /** ```mermaid 블록 */
  mermaid: boolean;
  /** $ 글자 — 수식인지는 수식 확장이 가린다. 여기서는 받을지만 정한다 */
  math: boolean;
}

// 여는 펜스(``` · ~~~) 뒤의 언어 이름 — 닫는 펜스에는 이름이 없다
const FENCE_LANGUAGE = /^ {0,3}(?:`{3,}|~{3,})[ \t]*([^\s`~]+)/gm;

export const detectFeatures = (body: string): MarkdownFeatures => {
  let code = false;
  let mermaid = false;

  for (const [, language] of body.matchAll(FENCE_LANGUAGE)) {
    if (language.toLowerCase() === "mermaid") mermaid = true;
    else code = true;
  }

  return { code, mermaid, math: body.includes("$") };
};
