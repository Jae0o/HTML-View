import type { TagProps } from "./Tag.types";

import clsx from "clsx";

const Tag = ({ children, className }: TagProps) => (
  <span
    className={clsx(
      "shrink-0 rounded-pill border border-border-default bg-surface-default px-8 text-sm text-text-tertiary",
      className,
    )}
  >
    {children}
  </span>
);

export default Tag;
