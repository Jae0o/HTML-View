import type { IconCommonProps } from "../types";

// 출처: 0Docs 도움말 창 결정 — 도움말(원 안의 물음표). 원본 그림이 없어 직접 그렸다
// 획 두께는 화면 기준으로 고정한다 (vectorEffect). 원 바깥 가장자리가 1 · 15px 정수 자리에 닿는다.
// 물음표 줄기 끝(10.25)과 점 위(11.25) 사이를 1px 띄운다 — DPR 1 에서 둘이 붙어 번지지 않게
const HelpIcon = ({ size = 16, ...rest }: IconCommonProps) => (
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
      cx="8"
      cy="8"
      r="6.25"
      stroke="currentColor"
      strokeWidth="1.5"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M6.25 6.5a1.75 1.75 0 1 1 2.6 1.53c-.5.28-.85.67-.85 1.22v.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
    <circle
      cx="8"
      cy="12"
      r="0.75"
      fill="currentColor"
    />
  </svg>
);

export default HelpIcon;
