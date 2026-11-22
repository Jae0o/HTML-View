import { TruncatedText } from "@views/components/common";
import { ChevronRightIcon } from "@views/components/icons";

import type { TreeRowDepth, TreeRowProps } from "./TreeRow.types";

import clsx from "clsx";

// 단마다 16px 씩 들여 쓴다
const DEPTH_CLASS: Record<TreeRowDepth, string> = {
  0: "pl-8",
  1: "pl-24",
  2: "pl-40",
};

/**
 * 목록 줄 — 등록 폴더 · HTML 폴더 · 문서가 같은 모양을 쓴다.
 * 이름은 두 줄까지 보인다. 줄은 위로 맞추고, 앞 아이콘 · 꼬리표 · 버튼은 글자 한 줄 높이(20px) 칸 가운데에 둬 첫 줄과 맞춘다
 */
const TreeRow = ({ depth, icon, label, expanded, selected = false, trailing, actions, onClick }: TreeRowProps) => (
  <div
    className={clsx(
      "group relative flex min-h-[3.6rem] items-start gap-8 rounded-6 py-8 pr-8 text-base",
      DEPTH_CLASS[depth],
      selected ? "bg-brand-bg-muted font-semibold text-text-brand" : "text-text-primary",
      // 줄 안의 메뉴(⋯)를 연 동안에도 마우스를 올린 바탕을 유지한다
      !selected &&
        onClick &&
        "hover:bg-brand-bg-subtle has-[[aria-haspopup=menu][aria-expanded=true]]:bg-brand-bg-subtle",
    )}
  >
    {onClick && (
      <button
        type="button"
        aria-label={label}
        aria-expanded={expanded}
        aria-current={selected ? "true" : undefined}
        onClick={onClick}
        className="absolute inset-0 cursor-pointer rounded-6 bg-transparent"
      />
    )}
    {(expanded !== undefined || icon) && (
      <div className="flex h-20 shrink-0 items-center gap-8">
        {expanded !== undefined && (
          // 돌린 화살표(transform)는 줄 버튼 위 층에 그려져 누름을 가로챈다 — 마우스를 통과시켜 줄 버튼이 받게 한다
          <ChevronRightIcon
            size={16}
            className={clsx(
              "pointer-events-none shrink-0 text-text-tertiary transition-transform duration-200 motion-reduce:transition-none",
              expanded && "rotate-90",
            )}
          />
        )}
        {icon}
      </div>
    )}
    {/* 이름은 버튼 위에 올려 마우스를 받는다(말줄임 펼침). 이름을 눌러도 줄이 눌리게 같은 동작을 건다 */}
    <div
      className={clsx("relative min-w-0 flex-1", onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <TruncatedText
        text={label}
        lines={2}
        fitCell
      />
    </div>
    {trailing && <div className="flex h-20 shrink-0 items-center">{trailing}</div>}
    {actions && <div className="relative flex h-20 items-center gap-4">{actions}</div>}
  </div>
);

export default TreeRow;
