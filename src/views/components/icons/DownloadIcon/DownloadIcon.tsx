import type { IconCommonProps } from "../types";

// 출처: 0Docs 문서 유틸 결정 — 다운로드(아래 화살표와 받침선). 원본 그림이 없어 직접 그렸다
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
      d="M8 2.75v7.5M4.75 7.25l3.25 3.25l3.25 -3.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M2.75 13.25h10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export default DownloadIcon;
