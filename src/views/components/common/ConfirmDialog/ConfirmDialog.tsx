import { useId } from "react";

import { Button } from "../Button";
import { Dialog } from "../Dialog";
import type { ConfirmDialogProps } from "./ConfirmDialog.types";

/**
 * 확인 창 — 되돌릴 수 없는 동작 전에 한 번 묻는다.
 * 창 틀(덮개 · 가운데 · Esc · 흐림)은 공용 창 틀(Dialog)이 맡는다.
 */
const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "취소",
  tone = "default",
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Dialog
      open={open}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onCancel}
    >
      <div className="flex flex-col gap-24 p-24">
        <div className="flex flex-col gap-8">
          <h2
            id={titleId}
            className="m-0 text-base font-semibold"
          >
            {title}
          </h2>
          <p
            id={descriptionId}
            className="m-0 text-sm text-text-secondary"
          >
            {description}
          </p>
        </div>
        {children}
        <div className="flex justify-end gap-16">
          {/* 입력 칸이 없으면 창이 열릴 때 브라우저가 첫 버튼에 포커스를 둔다 — 취소가 먼저여야 실수로 Enter 를 눌러도 동작이 실행되지 않는다. 순서를 바꾸지 않는다 */}
          <Button onClick={onCancel}>{cancelLabel}</Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
