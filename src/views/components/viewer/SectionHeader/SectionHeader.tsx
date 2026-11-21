import type { SectionHeaderProps } from "./SectionHeader.types";

/** 구역 제목 줄 — 목록 상자 안에서 구역을 나눈다 */
const SectionHeader = ({ title, action, trailing }: SectionHeaderProps) => (
  <div className="flex h-32 items-center gap-8 pl-8">
    {/* 제목과 바로 옆 버튼이 남는 폭을 차지해, 뒤 버튼이 오른쪽 끝으로 간다 */}
    <div className="flex min-w-0 flex-1 items-center gap-8">
      <h2 className="m-0 text-sm font-semibold text-text-secondary">{title}</h2>
      {action}
    </div>
    {trailing}
  </div>
);

export default SectionHeader;
