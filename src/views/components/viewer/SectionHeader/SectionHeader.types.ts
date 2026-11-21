import type { ReactNode } from "react";

export interface SectionHeaderProps {
  title: string;
  /** 제목 바로 오른쪽에 붙는 버튼 */
  action?: ReactNode;
  /** 줄 오른쪽 끝에 놓는 버튼 */
  trailing?: ReactNode;
}
