import type { FloatingSurfaceProps } from "./FloatingSurface.types";

import clsx from "clsx";

/** 떠 있는 상자의 공통 모양 — 위치 · 크기 · 겹침 순서는 쓰는 쪽이 정한다 */
const FloatingSurface = ({ className, children, ref, ...rest }: FloatingSurfaceProps) => (
  <div
    {...rest}
    ref={ref}
    className={clsx("rounded-6 border border-border-default bg-surface-default shadow-float", className)}
  >
    {children}
  </div>
);

export default FloatingSurface;
