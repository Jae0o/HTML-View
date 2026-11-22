import type { IconCommonProps } from "../types";

// 출처: tabler `copy`. 화면 획 1px — 오른쪽 위 문서 버튼(새로고침 · 다운로드)과 같은 굵기 (icon-guide 「화면 획 굵기」)
// 획 두께는 화면 기준으로 고정한다 (vectorEffect) — 크기가 달라도 두께가 같다
const CopyIcon = ({ size = 16, ...rest }: IconCommonProps) => (
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
      d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export default CopyIcon;
