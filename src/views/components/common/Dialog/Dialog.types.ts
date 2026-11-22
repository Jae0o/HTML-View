import type { ReactNode } from "react";

/** s 360px(확인 창) · m 480px(도움말 창) */
export type DialogWidth = "s" | "m";

export interface DialogProps {
  open: boolean;
  /** 창 제목 요소의 id — 화면 낭독기가 창 이름으로 읽는다 */
  "aria-labelledby": string;
  /** 창 설명 요소의 id */
  "aria-describedby"?: string;
  width?: DialogWidth;
  /** Esc 를 눌렀을 때 — 닫을지는 부모가 open 으로 정한다 */
  onClose: () => void;
  /** 창 안 내용 — 안쪽 여백은 내용이 정한다 */
  children: ReactNode;
}
