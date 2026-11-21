/** 보여 줄 줄 수 — 넘치면 마지막 줄 끝을 말줄임한다 */
export type TruncatedTextLines = 1 | 2;

export interface TruncatedTextProps {
  /** 보여 줄 글자. 잘렸을 때만 펼친다 */
  text: string;
  /** 보여 줄 줄 수. 기본 1 */
  lines?: TruncatedTextLines;
  /**
   * 목록 줄처럼 누를 것이 붙은 칸 — 펼친 상자를 칸 폭으로만 펼치고(최소 320px 없음) 마우스를 받지 않는다.
   * 상자가 옆 버튼 · 아래 줄을 가려도 그대로 눌린다. 글자에서 벗어나면 바로 닫힌다
   */
  fitCell?: boolean;
  /** 바깥 칸에 붙일 클래스 — 폭 · 늘어남은 쓰는 쪽이 정한다 */
  className?: string;
}
