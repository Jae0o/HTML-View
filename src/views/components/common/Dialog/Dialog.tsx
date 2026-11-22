import { type MouseEvent, type PointerEvent, type SyntheticEvent, useEffect, useRef } from "react";

import type { DialogProps, DialogWidth } from "./Dialog.types";

import clsx from "clsx";

const WIDTH_CLASS: Record<DialogWidth, string> = {
  s: "w-[36rem]",
  m: "w-[48rem]",
};

/**
 * 창 틀 — 화면 가운데에 뜨고 뒤 화면을 어둡게 덮는다. 확인 창 · 도움말 창이 같이 쓴다.
 * 브라우저 기본 창(dialog) 을 쓴다: 뒤 화면 덮개 · 포커스 가두기 · 맨 위 층 띄우기 · 닫은 뒤 포커스 돌려주기를 브라우저가 맡는다.
 */
const Dialog = ({
  open,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  width = "s",
  onClose,
  closeOnBackdrop = false,
  children,
}: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  // 누르기 시작한 곳도 바깥이어야 닫는다 — 창 안 글자를 끌어 고르다 바깥에서 떼면 닫히지 않게
  const isBackdropPressRef = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Esc — 브라우저가 스스로 닫지 않게 막고, 닫을지는 부모가 open 으로 정한다
  const handleCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onClose();
  };

  // 안쪽 내용이 창을 꽉 채워, 창 요소 자체가 눌린 것은 바깥(덮개)을 누른 것이다
  const handlePointerDown = (e: PointerEvent<HTMLDialogElement>) => {
    isBackdropPressRef.current = e.target === e.currentTarget;
  };

  const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdrop && isBackdropPressRef.current && e.target === e.currentTarget) onClose();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onCancel={handleCancel}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      // 열 때 · 닫을 때 창과 덮개가 함께 흐려진다. 닫힌 뒤에도 사라짐이 끝날 때까지 맨 위 층에 남긴다(display · overlay 전환)
      className={clsx(
        "m-auto max-w-[calc(100vw-3.2rem)] rounded-12 bg-surface-default text-text-primary opacity-0 shadow-float transition-[opacity,display,overlay] transition-discrete duration-200 backdrop:bg-bg-overlay backdrop:opacity-0 backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-200 open:opacity-100 open:backdrop:opacity-100 starting:open:opacity-0 starting:open:backdrop:opacity-0",
        WIDTH_CLASS[width],
      )}
    >
      {children}
    </dialog>
  );
};

export default Dialog;
