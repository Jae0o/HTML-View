import type { IconCommonProps } from "../types";

// 출처: 프로토타입 — 목록 열기 · 접기
// 획 두께는 화면 기준으로 고정한다 (vectorEffect) — 크기가 달라도 두께가 같다
const MenuIcon = ({ size = 16, ...rest }: IconCommonProps) => (
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
      d="M2.5 4h11M2.5 8h11M2.5 12h11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export default MenuIcon;
