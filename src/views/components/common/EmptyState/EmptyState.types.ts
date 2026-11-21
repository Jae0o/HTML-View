import type { ReactNode } from "react";

/** default 기본 · muted 문제 상황(마크를 흐리게) */
export type EmptyStateTone = "default" | "muted";

export interface EmptyStateProps {
  tone?: EmptyStateTone;
  title: string;
  description?: string;
  /** 버튼 줄 */
  actions?: ReactNode;
}
