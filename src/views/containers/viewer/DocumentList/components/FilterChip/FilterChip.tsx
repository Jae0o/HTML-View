import type { ReactNode } from "react";

interface FilterChipProps {
  label: string;
  icon: ReactNode;
  /** 켜져 있는지 — 눌림 상태(aria-pressed)로 알린다 */
  pressed: boolean;
  /** 켜진 마지막 하나라 끌 수 없을 때 (결정 MD-A2) */
  disabled?: boolean;
  onClick: () => void;
}

// 크기 · 간격은 확인 CK-D1 회신(2026-11-22) 값 — 칩 컴포넌트 문서가 없어 목록 안 하위 부품으로 둔다
const CHIP_ON_CLASS =
  "inline-flex h-[2.4rem] cursor-pointer items-center gap-4 rounded-6 border border-brand-bg bg-brand-bg-muted px-8 text-sm font-semibold text-text-brand disabled:cursor-default disabled:opacity-60";
const CHIP_OFF_CLASS =
  "inline-flex h-[2.4rem] cursor-pointer items-center gap-4 rounded-6 border border-border-default bg-surface-default px-8 text-sm text-text-secondary hover:bg-brand-bg-subtle hover:text-text-brand";

/** 목록 위 칩 한 개 — 누르면 켜고 끈다 */
const FilterChip = ({ label, icon, pressed, disabled = false, onClick }: FilterChipProps) => (
  <button
    type="button"
    aria-pressed={pressed}
    disabled={disabled}
    onClick={onClick}
    className={pressed ? CHIP_ON_CLASS : CHIP_OFF_CLASS}
  >
    {icon}
    {label}
  </button>
);

export default FilterChip;
