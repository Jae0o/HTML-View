import type { ReactNode } from "react";

/** 풍선이 뜨는 쪽 */
export type TooltipPlacement = "bottom" | "top";

export interface TooltipProps {
  /** 풍선에 보일 글자 */
  label: string;
  placement?: TooltipPlacement;
  /** 풍선을 붙일 대상 (버튼 등) */
  children: ReactNode;
}
