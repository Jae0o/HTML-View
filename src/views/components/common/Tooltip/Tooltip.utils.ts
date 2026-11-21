import type { TooltipPlacement } from "./Tooltip.types";

/** 대상과 풍선 사이 간격(px) */
const GAP = 6;

export interface AnchorRect {
  top: number;
  bottom: number;
  left: number;
  width: number;
}

export interface TooltipPosition {
  /** bottom 이면 풍선 위 끝, top 이면 풍선 아래 끝이 올 자리(px) */
  top: number;
  /** 풍선 가운데가 올 자리(px) */
  left: number;
}

/** 풍선 자리(px) — 대상의 가로 가운데, 대상에서 6px 떨어진 곳 */
export const calcTooltipPosition = (rect: AnchorRect, placement: TooltipPlacement): TooltipPosition => ({
  top: placement === "bottom" ? rect.bottom + GAP : rect.top - GAP,
  left: rect.left + rect.width / 2,
});
