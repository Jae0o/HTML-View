import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useEscClose } from "@libs/hooks/common";

import { FloatingSurface, IconButton, Tooltip } from "@views/components/common";
import { MoreIcon } from "@views/components/icons";

import { ROW_ACTION_REVEAL_CLASS } from "../../DocumentList.constants";
import { useClickAway } from "../../hooks";

interface MoreMenuItem {
  label: string;
  onSelect: () => void;
}

interface MoreMenuProps {
  items: MoreMenuItem[];
}

/** ⋯ 버튼과 메뉴 사이 간격(px) */
const GAP = 4;

/** 메뉴가 화면 아래 끝에서 남길 여백(px) */
const EDGE_MARGIN = 8;

interface MenuAnchor {
  /** ⋯ 버튼 위 끝(px) — 위로 펼칠 때 기준 */
  top: number;
  /** ⋯ 버튼 아래 끝(px) — 아래로 펼칠 때 기준 */
  bottom: number;
  /** 화면 오른쪽 끝에서 메뉴 오른쪽 끝까지(px) — 메뉴를 ⋯ 버튼 오른쪽 끝에 맞춘다 */
  right: number;
}

/**
 * 줄 오른쪽 끝의 ⋯ 버튼과 옵션 메뉴. 메뉴는 맨 위 층에 띄운다 — 스크롤되는 목록 안에서도 잘리지 않는다.
 * 버튼 아래로 열고, 화면 아래가 모자라면 위로 연다.
 * 닫기: 항목 누름 · 메뉴 밖 누름 · Esc · 스크롤 · 창 크기 변경 · ⋯ 다시 누름. 열려 있는 동안 ⋯ 는 늘 보인다
 */
const MoreMenu = ({ items }: MoreMenuProps) => {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState<MenuAnchor | null>(null);
  const isOpen = anchor !== null;

  const close = useCallback(() => setAnchor(null), []);

  // Esc 로 닫으면 포커스를 ⋯ 버튼으로 돌린다 — 메뉴 항목이 사라지며 포커스를 잃지 않게
  const closeToTrigger = useCallback(() => {
    setAnchor(null);
    triggerRef.current?.querySelector("button")?.focus();
  }, []);

  // 메뉴는 이 칸의 React 자식이라, 메뉴를 눌러도 이 칸의 onPointerDown 이 불린다 — 안쪽으로 센다
  const markInside = useClickAway(isOpen, close);

  const toggle = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (isOpen || !rect) {
      close();
      return;
    }

    // 화면 폭은 세로 스크롤바를 뺀 값이어야 오른쪽 끝이 버튼과 맞는다
    setAnchor({ top: rect.top, bottom: rect.bottom, right: document.documentElement.clientWidth - rect.right });
  };

  // 메뉴 높이는 그린 뒤에 잰다. 아래로 펼쳐 화면 아래 8px 안에 못 들어오면 위로 연다. 그리기 전 DOM 에 바로 적어 깜빡임이 없다
  useLayoutEffect(() => {
    const element = menuRef.current;
    if (!anchor || !element) return;

    const height = element.getBoundingClientRect().height;
    const fitsBelow = anchor.bottom + GAP + height <= window.innerHeight - EDGE_MARGIN;
    element.style.top = `${fitsBelow ? anchor.bottom + GAP : anchor.top - GAP - height}px`;
  }, [anchor]);

  // 맨 위 층에 띄운 메뉴는 버튼을 따라 움직이지 않는다 — 스크롤 · 창 크기 변경 때 닫는다
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [isOpen, close]);

  useEscClose(isOpen, closeToTrigger);

  return (
    <span
      ref={triggerRef}
      className="inline-flex"
      onPointerDown={markInside}
    >
      {/* 도움말은 위로 띄운다 — 아래로 열리는 메뉴를 가리지 않게 */}
      <Tooltip
        label="더보기"
        placement="top"
      >
        <IconButton
          size="s"
          aria-label="더보기"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          icon={<MoreIcon />}
          className={isOpen ? undefined : ROW_ACTION_REVEAL_CLASS}
          onClick={toggle}
        />
      </Tooltip>

      {anchor &&
        createPortal(
          <FloatingSurface
            ref={menuRef}
            role="menu"
            aria-label="더보기"
            className="fixed z-500 flex min-w-[16rem] flex-col p-4"
            // 자리는 열 때 잰 값이라 클래스로 적을 수 없다. 화면에서 잰 px 를 그대로 넣는다 (위 끝은 그린 뒤 높이를 재서 정한다)
            style={{ right: `${anchor.right}px` }}
          >
            {items.map((item, index) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                autoFocus={index === 0}
                className="flex h-32 cursor-pointer items-center rounded-6 bg-transparent px-8 text-left text-base text-text-primary hover:bg-surface-hover"
                onClick={() => {
                  close();
                  item.onSelect();
                }}
              >
                {item.label}
              </button>
            ))}
          </FloatingSurface>,
          document.body,
        )}
    </span>
  );
};

export default MoreMenu;
