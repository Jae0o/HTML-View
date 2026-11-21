import type { ButtonHTMLAttributes, ReactNode } from "react";

/** 기본(테두리) · 채움 · 위험 · 글자 */
export type ButtonVariant = "default" | "primary" | "danger" | "text";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** 글자 앞 아이콘. size 를 안 넘기면 16px 로 맞춘다 (icon-guide 「Button 과의 계약」) */
  icon?: ReactNode;
}
