export interface ViewerState {
  /** 문서 목록이 열려 있는지. 기기에 기억한다 */
  isListOpen: boolean;
  /** 열기 · 접기 버튼 */
  toggleList: () => void;
}
