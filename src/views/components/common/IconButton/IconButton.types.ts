import type { ButtonHTMLAttributes, ReactNode } from "react";

/** 테두리 · 투명 */
export type IconButtonVariant = "outline" | "ghost";

/** m 32px · s 20px (목록 줄 안) */
export type IconButtonSize = "m" | "s";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children"> {
  /** 글자가 없는 버튼이라 읽어 주는 이름을 반드시 받는다 */
  "aria-label": string;
  /** 아이콘. size 를 안 넘기면 16px 로 맞춘다 */
  icon: ReactNode;
  /** 크기 s 에는 테두리가 없어 적용되지 않는다 */
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** 켜고 끄는 버튼일 때만 넘긴다. 켜지면 즐겨찾기 색으로 바뀐다 */
  pressed?: boolean;
  /** 본문 위에 떠 있는 버튼 — 그림자를 붙인다 */
  floating?: boolean;
}
