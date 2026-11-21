import type { IconCommonProps } from "../types";

// 출처: 프로토타입 — 목록 줄 펼침 화살표
// 획 두께는 화면 기준으로 고정한다 (vectorEffect) — 크기가 달라도 두께가 같다
const ChevronRightIcon = ({ size = 16, ...rest }: IconCommonProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...rest}
  >
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export default ChevronRightIcon;
