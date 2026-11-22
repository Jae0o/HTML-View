/** 맨 앞 머리말(--- 사이)과 본문 */
export interface FrontMatter {
  /** 이름 · 값 — 적힌 순서. 여러 줄 값은 줄바꿈으로 잇는다 */
  entries: [string, string][];
  body: string;
}

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const ENTRY = /^([^\s:][^:]*):[ \t]*(.*)$/;
// 앞 항목 값에 붙는 줄 — 들여 쓴 줄 · 목록 줄
const CONTINUATION = /^(?:[ \t]+\S|- )/;

/**
 * 맨 앞 머리말을 본문에서 떼어 낸다. YAML 해석 부품은 쓰지 않는다.
 * 사이의 비어 있지 않은 줄이 모두 「이름: 값」 이거나 이어지는 줄일 때만 머리말이다 —
 * 구분선(---)으로 시작하는 본문을 머리말로 먹지 않는다
 */
export const splitFrontMatter = (text: string): FrontMatter => {
  const match = FENCE.exec(text);
  if (!match) return { entries: [], body: text };

  const entries: [string, string][] = [];

  for (const line of match[1].split(/\r?\n/)) {
    if (line.trim() === "") continue;

    const entry = ENTRY.exec(line);
    if (entry && !CONTINUATION.test(line)) {
      entries.push([entry[1].trim(), entry[2].trim()]);
      continue;
    }

    const last = entries.at(-1);
    if (!last || !CONTINUATION.test(line)) return { entries: [], body: text };

    last[1] = last[1] ? `${last[1]}\n${line.trim()}` : line.trim();
  }

  return entries.length > 0 ? { entries, body: text.slice(match[0].length) } : { entries: [], body: text };
};
