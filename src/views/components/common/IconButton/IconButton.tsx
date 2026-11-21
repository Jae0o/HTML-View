import { type ReactNode, cloneElement, isValidElement } from "react";

import type { IconButtonProps } from "./IconButton.types";

import clsx from "clsx";

/** 버튼 안 아이콘 크기(px) */
const ICON_SIZE = 16;

const resolveIcon = (icon: ReactNode): ReactNode => {
  if (!isValidElement<{ size?: number | string }>(icon) || icon.props.size !== undefined) return icon;

  return cloneElement(icon, { size: ICON_SIZE });
};

const IconButton = ({
  icon,
  variant = "outline",
  size = "m",
  pressed,
  floating = false,
  className,
  type,
  ...rest
}: IconButtonProps) => {
  const isOn = pressed === true;

  return (
    <button
      {...rest}
      type={type ?? "button"}
      aria-pressed={pressed}
      className={clsx(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-6",
        size === "m" && "size-32 border",
        size === "m" && !isOn && "text-text-secondary hover:bg-brand-bg-subtle hover:text-text-brand",
        size === "m" && !isOn && variant === "outline" && "border-border-default bg-surface-default",
        size === "m" && !isOn && variant === "ghost" && "border-transparent bg-transparent",
        size === "m" && isOn && "border-brand-bg-muted bg-brand-bg-subtle text-favorite-on",
        size === "s" && "size-20 bg-transparent hover:bg-surface-active",
        size === "s" && !isOn && "text-text-tertiary hover:text-text-primary",
        size === "s" && isOn && "text-favorite-on",
        floating && "shadow-float",
        className,
      )}
    >
      {resolveIcon(icon)}
    </button>
  );
};

export default IconButton;
