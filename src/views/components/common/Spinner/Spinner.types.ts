/** brand 초록 (줄 안) · neutral 회색 (버튼 안) */
export type SpinnerTone = "brand" | "neutral";

export interface SpinnerProps {
  tone?: SpinnerTone;
  /** 지름. 숫자는 px */
  size?: number | string;
  className?: string;
}
