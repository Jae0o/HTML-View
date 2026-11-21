import type { ReactNode } from "react";

export interface SectionHeaderProps {
  title: string;
  /** 제목 바로 오른쪽에 붙는 버튼 */
  action?: ReactNode;
}
