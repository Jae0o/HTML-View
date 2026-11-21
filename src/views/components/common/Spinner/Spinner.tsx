import type { SpinnerProps, SpinnerTone } from "./Spinner.types";

import clsx from "clsx";

// 바탕 고리 색 · 도는 조각 색
const TONE_CLASS: Record<SpinnerTone, { track: string; arc: string }> = {
  brand: { track: "stroke-brand-bg-muted", arc: "stroke-brand-bg" },
  neutral: { track: "stroke-border-default", arc: "stroke-text-secondary" },
};

const Spinner = ({ tone = "brand", size = 16, className }: SpinnerProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    role="status"
    aria-label="불러오는 중"
    className={clsx("shrink-0 animate-spin", className)}
  >
    <circle
      cx="8"
      cy="8"
      r="7"
      strokeWidth="2"
      className={TONE_CLASS[tone].track}
    />
    <path
      d="M8 1a7 7 0 0 1 7 7"
      strokeWidth="2"
      strokeLinecap="round"
      className={TONE_CLASS[tone].arc}
    />
  </svg>
);

export default Spinner;
