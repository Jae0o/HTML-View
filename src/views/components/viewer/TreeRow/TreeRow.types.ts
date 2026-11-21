import type { ReactNode } from "react";

/** 들여쓰기 단 — 0 등록 폴더 · 1 HTML 폴더 · 2 문서 */
export type TreeRowDepth = 0 | 1 | 2;

export interface TreeRowProps {
  depth: TreeRowDepth;
  /** 이름 앞 아이콘 */
  icon?: ReactNode;
  label: string;
  /** 펼칠 수 있는 줄일 때만 넘긴다 — 화살표가 붙는다 */
  expanded?: boolean;
  /** 지금 보고 있는 문서의 줄 */
  selected?: boolean;
  /** 이름 뒤에 붙는 것 (개수 꼬리표 · 버튼) */
  trailing?: ReactNode;
  /** 줄 오른쪽 끝의 버튼. 줄과 따로 눌린다. 줄에 마우스를 올렸을 때만 보이게 하려면 버튼에 `group-hover:` 클래스를 건다 */
  actions?: ReactNode;
  /** 줄을 눌렀을 때. 없으면 누를 수 없는 줄이다 */
  onClick?: () => void;
}
