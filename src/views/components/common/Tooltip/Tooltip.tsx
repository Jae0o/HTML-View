import { type FocusEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useEscClose } from "@libs/hooks/common";

import type { TooltipProps } from "./Tooltip.types";
import { type TooltipPosition, calcTooltipPosition } from "./Tooltip.utils";

import clsx from "clsx";

/**
 * 도움말 풍선 — 대상에 마우스를 올리거나 키보드(Tab) 포커스가 가면 보인다.
 * 화면 맨 위 층에 띄운다: 스크롤되는 상자 안의 버튼에 붙여도 잘리지 않는다.
 * 대상의 읽어 주는 이름과 같은 글자라 화면 낭독기에는 숨긴다.
 */
const Tooltip = ({ label, placement = "bottom", children }: TooltipProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  // 사라지는 동안에도 자리를 그대로 두어야 한다 — 열림만 끄고, 자리는 사라짐이 끝나면 비운다
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const [visible, setVisible] = useState(false);

  const close = useCallback(() => setVisible(false), []);

  const show = () => {
    const element = ref.current;
    if (!element) return;

    setPosition(calcTooltipPosition(element.getBoundingClientRect(), placement));
    setVisible(true);
  };

  const handleFocus = (e: FocusEvent<HTMLSpanElement>) => {
    // 마우스로 눌러 생긴 포커스에는 띄우지 않는다 — 키보드 포커스만
    if (!e.target.matches(":focus-visible")) return;

    show();
  };

  // 맨 위 층에 띄운 풍선은 대상을 따라 움직이지 않는다 — 스크롤 · 창 크기 변경 때 닫는다
  useEffect(() => {
    if (!visible) return;

    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [visible, close]);

  useEscClose(visible, close);

  return (
    <span
      ref={ref}
      className="inline-flex"
      onMouseEnter={show}
      onMouseLeave={close}
      onFocus={handleFocus}
      onBlur={close}
    >
      {children}
      {position &&
        createPortal(
          <span
            aria-hidden="true"
            className={clsx(
              "pointer-events-none fixed z-9999 -translate-x-1/2 rounded-6 bg-bg-inverse px-8 py-4 text-sm whitespace-nowrap text-text-inverse transition-opacity starting:opacity-0",
              placement === "top" && "-translate-y-full",
              !visible && "opacity-0",
            )}
            // 자리는 그릴 때 잰 값이라 클래스로 적을 수 없다. 화면에서 잰 px 를 그대로 넣는다
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
            onTransitionEnd={() => {
              if (!visible) setPosition(null);
            }}
          >
            {label}
          </span>,
          document.body,
        )}
    </span>
  );
};

export default Tooltip;
