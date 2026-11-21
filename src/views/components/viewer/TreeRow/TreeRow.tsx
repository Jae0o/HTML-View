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
 * 줄 전체를 덮는 버튼을 맨 아래에 깔고 글자 · 아이콘을 그 위에 얹는다 — 이름(말줄임 펼침)이 버튼 안에 들어가지 않게 한다.
 */
const TreeRow = ({ depth, icon, label, expanded, trailing, actions, onClick }: TreeRowProps) => (
  <div
    className={clsx(
      "relative flex h-32 items-center gap-8 rounded-6 pr-8 text-base text-text-primary",
      DEPTH_CLASS[depth],
      onClick && "hover:bg-brand-bg-subtle",
    )}
  >
    {onClick && (
      <button
        type="button"
        aria-label={label}
        aria-expanded={expanded}
        onClick={onClick}
        className="absolute inset-0 cursor-pointer rounded-6 bg-transparent"
      />
    )}
    {expanded !== undefined && (
      <ChevronRightIcon
        size={16}
        className={clsx("shrink-0 text-text-tertiary", expanded && "rotate-90")}
      />
    )}
    {icon}
    {/* 이름은 버튼 위에 올려 마우스를 받는다(말줄임 펼침). 이름을 눌러도 줄이 눌리게 같은 동작을 건다 */}
    <div
      className={clsx("relative min-w-0 flex-1", onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <TruncatedText text={label} />
    </div>
    {trailing}
    {actions && <div className="relative flex items-center">{actions}</div>}
  </div>
);

export default TreeRow;
