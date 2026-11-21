import type { IconCommonProps } from "../types";

// 출처: 프로토타입 — 검색 칸
// 획 두께는 화면 기준으로 고정한다 (vectorEffect) — 크기가 달라도 두께가 같다
const SearchIcon = ({ size = 16, ...rest }: IconCommonProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...rest}
  >
    <path
      d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M21 21l-6 -6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export default SearchIcon;
