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
  onConfirm: () => void;
  /** 취소 버튼 · Esc */
  onCancel: () => void;
}
