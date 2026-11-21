import type { SectionHeaderProps } from "./SectionHeader.types";

/** 구역 제목 줄 — 목록 상자 안에서 구역을 나눈다 */
const SectionHeader = ({ title, action }: SectionHeaderProps) => (
  <div className="flex h-32 items-center gap-8 pl-8">
    <h2 className="m-0 text-sm font-semibold text-text-secondary">{title}</h2>
    {action}
  </div>
);

export default SectionHeader;
