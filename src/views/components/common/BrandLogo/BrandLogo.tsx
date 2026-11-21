import { LogoMark } from "../LogoMark";

/** 서비스명 — 마크가 「0」 역할을 하고 뒤에 Docs 가 붙어 0Docs 로 읽힌다 */
const BrandLogo = () => (
  <span
    role="img"
    aria-label="0Docs"
    className="inline-flex items-center gap-2 text-logo font-bold tracking-logo text-text-primary"
  >
    <LogoMark size={20} />
    <span aria-hidden="true">Docs</span>
  </span>
);

export default BrandLogo;
