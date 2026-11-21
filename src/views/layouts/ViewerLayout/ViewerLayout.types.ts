import type { ReactNode } from "react";

export interface ViewerLayoutProps {
  /** 본문 — 화면 전체를 쓴다 */
  children: ReactNode;
  /** 본문 위에 떠 있는 것 (문서 목록 · 목록 열기 버튼) — 자리는 넘기는 쪽이 정한다 */
  floating?: ReactNode;
}
