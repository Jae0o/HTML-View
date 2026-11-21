import { type ReactNode, type TransitionEvent, useState } from "react";

import clsx from "clsx";

interface CollapseProps {
  open: boolean;
  /** 접고 펼 안쪽 줄들. 접혀도 지우지 않는다 — 안쪽 줄의 펼침 상태가 남는다 */
  children: ReactNode;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * 안쪽 줄을 접고 펴며 높이가 200ms 동안 바뀐다. 움직임 줄이기 설정이면 바로 바뀐다.
 * 접혀 있는 동안 안쪽은 포커스 · 누름을 받지 않는다(inert).
 */
const Collapse = ({ open, children }: CollapseProps) => {
  // 움직이는 동안과 접힌 동안만 넘침을 자른다 — 다 펼쳐지면 풀어 줄의 포커스 테두리가 잘리지 않게 한다
  const [prevOpen, setPrevOpen] = useState(open);
  const [isMoving, setIsMoving] = useState(false);

  // 열림이 바뀌면 움직임이 시작된다. 접다가 곧바로 다시 펴도 끝날 때까지 움직이는 중으로 본다.
  // 움직임 줄이기면 움직임이 없어 끝나는 이벤트도 오지 않는다
  if (open !== prevOpen) {
    setPrevOpen(open);
    setIsMoving(!window.matchMedia(REDUCED_MOTION_QUERY).matches);
  }

  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    // 안쪽에 든 다른 접기 칸의 움직임은 세지 않는다
    if (e.target === e.currentTarget) setIsMoving(false);
  };

  return (
    <div
      inert={!open}
      className={clsx(
        "grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={open && !isMoving ? "min-h-0" : "min-h-0 overflow-hidden"}>{children}</div>
    </div>
  );
};

export default Collapse;
