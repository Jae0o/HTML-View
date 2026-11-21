import {
  type CSSProperties,
  type FocusEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { useEscClose } from "@libs/hooks/common";

import type { TruncatedTextProps } from "./TruncatedText.types";
import { calcPopBox, calcPopTop } from "./TruncatedText.utils";
import { useTextTruncated } from "./hooks";

import clsx from "clsx";

interface PopState {
  top: number;
  left: number;
  width: number;
  /** 위로 펼칠 때 상자 아래 끝을 맞출 글자 아래 끝 */
  textBottom: number;
  /** 쓰는 자리의 글자 모양 · 색 · 배경 — 펼친 상자가 그대로 따른다 */
  look: CSSProperties;
}

const TRANSPARENT = "rgba(0, 0, 0, 0)";

// 그 순간 보이는 배경색 — 투명이 아닌 가장 가까운 조상의 배경
const findBackground = (element: HTMLElement): string => {
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    const background = getComputedStyle(node).backgroundColor;
    if (background !== TRANSPARENT && background !== "transparent") return background;
  }

  return getComputedStyle(document.body).backgroundColor;
};

/** 말줄임 펼침 — 한 줄로 잘린 글자를 잘렸을 때만 그 자리에서 펼친다 (디자인 시스템 「말줄임 펼침」) */
const TruncatedText = ({ text, className }: TruncatedTextProps) => {
  const { ref, isTruncated } = useTextTruncated(text);
  const popRef = useRef<HTMLSpanElement>(null);
  const popId = useId();
  // 사라지는 동안에도 자리를 그대로 두어야 한다 — 열림만 끄고, 자리는 사라짐이 끝나면 비운다
  const [pop, setPop] = useState<PopState | null>(null);
  const [open, setOpen] = useState(false);

  // 잘림이 풀리면(폭이 넓어짐) 열려 있어도 그리지 않는다 — effect 로 닫지 않고 렌더 중에 가른다
  const shown = isTruncated ? pop : null;
  const visible = shown !== null && open;

  const close = useCallback(() => setOpen(false), []);

  const show = () => {
    const element = ref.current;
    if (!isTruncated || !element) return;

    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);

    setPop({
      // 화면 폭은 세로 스크롤바를 뺀 값이어야 상자 끝이 스크롤바 밑에 가려지지 않는다
      ...calcPopBox(rect, document.documentElement.clientWidth),
      textBottom: rect.bottom,
      look: {
        font: style.font,
        lineHeight: style.lineHeight,
        color: style.color,
        background: findBackground(element),
      },
    });
    setOpen(true);
  };

  const handleFocus = (e: FocusEvent<HTMLSpanElement>) => {
    // 마우스 클릭 포커스로는 열지 않는다 — 키보드 포커스만
    if (!e.currentTarget.matches(":focus-visible")) return;

    show();
  };

  // 높이는 폭이 적용된 뒤에 잰다 — 폭에 따라 줄바꿈이 달라진다. 그리기 전 DOM 에 바로 적어 깜빡임 · 추가 렌더가 없다
  useLayoutEffect(() => {
    const element = popRef.current;
    if (!shown || !element) return;

    const top = calcPopTop(shown.top, shown.textBottom, element.getBoundingClientRect().height, window.innerHeight);
    element.style.top = `${top}px`;
  }, [shown]);

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
      className={clsx("block min-w-0", className)}
      tabIndex={isTruncated ? 0 : undefined}
      aria-describedby={visible ? popId : undefined}
      onMouseEnter={show}
      onMouseLeave={close}
      onFocus={handleFocus}
      onBlur={close}
    >
      <span
        ref={ref}
        className="block truncate"
      >
        {text}
      </span>

      {/* 포털을 바깥 span 자식으로 둔다 — 글자를 덮은 상자로 마우스가 옮겨가도 바깥 mouseleave 가 불리지 않는다 */}
      {shown &&
        createPortal(
          <span
            ref={popRef}
            id={popId}
            role="tooltip"
            className={clsx(
              "fixed z-9999 rounded-6 border border-border-default px-6 pt-[0.1rem] pb-4 wrap-anywhere shadow-float transition-opacity starting:opacity-0",
              !open && "pointer-events-none opacity-0",
            )}
            // 자리 · 폭과 쓰는 자리의 글자 모양은 그릴 때 잰 값이라 클래스로 적을 수 없다. 화면에서 잰 px 를 그대로 넣는다 (rem 으로 바꾸면 브라우저 글자 크기 설정에 따라 어긋난다)
            style={{
              ...shown.look,
              top: `${shown.top}px`,
              left: `${shown.left}px`,
              width: `${shown.width}px`,
            }}
            onTransitionEnd={() => {
              if (!open) setPop(null);
            }}
          >
            {text}
          </span>,
          document.body,
        )}
    </span>
  );
};

export default TruncatedText;
