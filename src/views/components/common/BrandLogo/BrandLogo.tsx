import { LogoMark } from "../LogoMark";
import type { BrandLogoProps, BrandLogoSize } from "./BrandLogo.types";

import clsx from "clsx";

const MARK_SIZE: Record<BrandLogoSize, number> = { m: 20, s: 16 };

const TEXT_CLASS: Record<BrandLogoSize, string> = { m: "text-logo", s: "text-base" };

/** 서비스명 — 마크가 「0」 역할을 하고 뒤에 Docs 가 붙어 0Docs 로 읽힌다. 글 사이에 넣을 때는 작은 크기(s)를 쓴다 */
const BrandLogo = ({ size = "m" }: BrandLogoProps) => (
  <span
    role="img"
    aria-label="0Docs"
    className={clsx(
      "inline-flex items-center gap-2 align-middle font-bold tracking-logo text-text-primary",
      TEXT_CLASS[size],
    )}
  >
    <LogoMark size={MARK_SIZE[size]} />
    <span aria-hidden="true">Docs</span>
  </span>
);

export default BrandLogo;
