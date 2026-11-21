import type { DocumentLocation } from "@libs/features/folder";

export interface ViewerState {
  /** 열기 · 접기 버튼으로 정한 목록 상태. 기기에 기억한다 */
  isListOpen: boolean;
  /** 문서를 고르거나 목록 밖을 눌러 잠깐 닫힌 상태. 기억하지 않는다 — 다시 들어오면 목록이 열린다 */
  isListDismissed: boolean;
  /** 고른 문서. 기기에 기억해 다시 들어오면 그 문서를 연다 */
  selectedDocument: DocumentLocation | null;
  /** 열기 · 접기 버튼 */
  toggleList: () => void;
  /** 목록 밖을 눌렀을 때 — 목록을 잠깐 닫는다 */
  dismissList: () => void;
  /** 문서를 고른다 — 목록을 잠깐 닫는다 */
  selectDocument: (document: DocumentLocation) => void;
}
