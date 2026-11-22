import type { IconCommonProps } from "../types";

// 출처: 0Docs 문서 유틸 결정 — 다운로드(아래 화살표와 받침선). 원본 그림이 없어 직접 그렸다
// 획 1 · 0.5 격자 (MD-09) — 새로고침 아이콘과 같은 굵기. 세로 줄 · 받침선 가운데를 8.5 에 맞춘다
// 획 두께는 화면 기준으로 고정한다 (vectorEffect)
const DownloadIcon = ({ size = 16, ...rest }: IconCommonProps) => (
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
      d="M8.5 2.5v8M5 7l3.5 3.5l3.5 -3.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M3 13.5h11"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export default DownloadIcon;
