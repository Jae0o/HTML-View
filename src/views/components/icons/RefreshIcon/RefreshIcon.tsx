import type { IconCommonProps } from "../types";

// 출처: tabler `refresh` (결정 MD-A15). 화면 획 1px — 다운로드 아이콘과 같은 굵기 (MD-08 · 09)
// 획 두께는 화면 기준으로 고정한다 (vectorEffect) — 크기가 달라도 두께가 같다
const RefreshIcon = ({ size = 16, ...rest }: IconCommonProps) => (
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
      d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export default RefreshIcon;
