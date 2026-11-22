import type { ReactNode } from "react";

/** default 채움(초록) · danger 위험(빨강) — 확인 버튼의 색 */
export type ConfirmDialogTone = "default" | "danger";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  /** 확인 버튼 글자 */
  confirmLabel: string;
  cancelLabel?: string;
  tone?: ConfirmDialogTone;
  /** 설명 아래 · 버튼 위에 둘 것 (이름 입력 칸). 포커스를 받을 수 있는 것이면 창이 열릴 때 포커스가 여기로 간다 */
  children?: ReactNode;
  onConfirm: () => void;
  /** 취소 버튼 · Esc */
  onCancel: () => void;
}
