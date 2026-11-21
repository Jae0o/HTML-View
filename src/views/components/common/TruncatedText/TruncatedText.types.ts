export interface TruncatedTextProps {
  /** 한 줄로 보여 줄 글자. 잘렸을 때만 펼친다 */
  text: string;
  /** 바깥 칸에 붙일 클래스 — 폭 · 늘어남은 쓰는 쪽이 정한다 */
  className?: string;
}
