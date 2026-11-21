import { LogoMark } from "../LogoMark";
import type { EmptyStateProps } from "./EmptyState.types";

import clsx from "clsx";

const EmptyState = ({ tone = "default", title, description, actions }: EmptyStateProps) => (
  <section className="flex flex-col items-center gap-16 text-center">
    <LogoMark
      size={48}
      className={clsx(tone === "muted" && "opacity-40 grayscale")}
    />
    <div className="flex flex-col items-center gap-8">
      <h2 className="m-0 text-base font-semibold text-text-primary">{title}</h2>
      {description && <p className="m-0 max-w-[32rem] text-sm text-text-tertiary">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-8">{actions}</div>}
  </section>
);

export default EmptyState;
