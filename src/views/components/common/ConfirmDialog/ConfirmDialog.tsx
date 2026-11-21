import { type SyntheticEvent, useEffect, useId, useRef } from "react";

import { Button } from "../Button";
import type { ConfirmDialogProps } from "./ConfirmDialog.types";

/**
 * 확인 창 — 되돌릴 수 없는 동작 전에 한 번 묻는다.
 * 브라우저 기본 창(dialog) 을 쓴다: 뒤 화면 덮개 · 포커스 가두기 · 맨 위 층 띄우기를 브라우저가 맡는다.
 */
const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "취소",
  tone = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Esc — 브라우저가 스스로 닫지 않게 막고, 닫을지는 부모가 open 으로 정한다
  const handleCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={handleCancel}
      className="m-auto w-[36rem] max-w-[calc(100vw-3.2rem)] rounded-12 bg-surface-default p-24 text-text-primary shadow-float backdrop:bg-bg-overlay"
    >
      <div className="flex flex-col gap-24">
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
        <div className="flex justify-end gap-16">
          {/* 창이 열리면 브라우저가 첫 버튼에 포커스를 둔다 — 취소가 먼저여야 실수로 Enter 를 눌러도 동작이 실행되지 않는다. 순서를 바꾸지 않는다 */}
          <Button onClick={onCancel}>{cancelLabel}</Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
