import type { IconCommonProps } from "../types";

// 출처: 0Docs 목록 메뉴 개선 결정 — 줄 더보기(가로 점 세 개)
// 점은 지름 2px 를 정수 좌표에 둔다 — DPR 1 에서 번지지 않는다
const MoreIcon = ({ size = 16, ...rest }: IconCommonProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...rest}
  >
    <circle
      cx="4"
      cy="8"
      r="1"
      fill="currentColor"
    />
    <circle
      cx="8"
      cy="8"
      r="1"
      fill="currentColor"
    />
    <circle
      cx="12"
      cy="8"
      r="1"
      fill="currentColor"
    />
  </svg>
);

export default MoreIcon;
