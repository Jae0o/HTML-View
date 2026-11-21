import { type ReactNode, cloneElement, isValidElement } from "react";

import type { ButtonProps, ButtonVariant } from "./Button.types";

import clsx from "clsx";

/** 버튼 안 아이콘 크기(px) */
const ICON_SIZE = 16;

// 높이 · 좌우 여백 · 글자 크기가 종류마다 달라 종류별로 통째로 적는다 (같은 속성 클래스를 겹쳐 쓰지 않는다)
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  default:
    "h-32 border-border-default bg-surface-default px-12 text-base text-text-primary hover:bg-surface-hover active:bg-surface-active",
  primary:
    "h-32 border-transparent bg-brand-bg-active px-12 text-base font-semibold text-brand-fg hover:bg-brand-bg-hover",
  danger:
    "h-32 border-transparent bg-danger-bg px-12 text-base font-semibold text-text-inverse hover:bg-danger-bg-hover",
  text: "h-24 border-transparent bg-transparent px-8 text-sm font-semibold text-text-brand hover:bg-brand-bg-subtle",
};

// 아이콘에 size 가 없으면 버튼이 크기를 정한다
const resolveIcon = (icon: ReactNode): ReactNode => {
  if (!isValidElement<{ size?: number | string }>(icon) || icon.props.size !== undefined) return icon;

  return cloneElement(icon, { size: ICON_SIZE });
};

const Button = ({ variant = "default", icon, children, className, type, ...rest }: ButtonProps) => (
  <button
    {...rest}
    type={type ?? "button"}
    className={clsx(
      "inline-flex cursor-pointer items-center gap-6 rounded-6 border whitespace-nowrap",
      VARIANT_CLASS[variant],
      className,
    )}
  >
    {resolveIcon(icon)}
    {children}
  </button>
);

export default Button;
