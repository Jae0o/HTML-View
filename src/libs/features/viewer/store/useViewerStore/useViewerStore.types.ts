import type { DocumentLocation } from "@libs/features/folder";

import type { FavoriteItem, ListView } from "../../types";

export interface ViewerState {
  /** 열기 · 접기 버튼으로 정한 목록 상태. 기기에 기억한다 */
  isListOpen: boolean;
  /** 문서를 고르거나 목록 밖을 눌러 잠깐 닫힌 상태. 기억하지 않는다 — 다시 들어오면 목록이 열린다 */
  isListDismissed: boolean;
  /** 고른 문서. 기기에 기억해 다시 들어오면 그 문서를 연다 */
  selectedDocument: DocumentLocation | null;
  /** 즐겨찾기 — 켠 순서. 기기에 기억한다 */
  favorites: FavoriteItem[];
  /** 목록 보기(전체 · 즐겨찾기만). 기기에 기억한다 */
  listView: ListView;
  /** 도움말 창이 열려 있는지. 기억하지 않는다 — 다시 들어오면 닫혀 있다 */
  isHelpOpen: boolean;
  /** 열기 · 접기 버튼 */
  toggleList: () => void;
  /** 목록 밖을 눌렀을 때 — 목록을 잠깐 닫는다 */
  dismissList: () => void;
  /** 문서를 고른다 — 목록을 잠깐 닫는다 */
  selectDocument: (document: DocumentLocation) => void;
  /** 즐겨찾기를 켜고 끈다 — 켜면 맨 뒤에 붙는다 */
  toggleFavorite: (item: FavoriteItem) => void;
  /** 등록 폴더와 그 안쪽 항목의 즐겨찾기를 모두 지운다 (등록 해제 때) */
  removeFavoritesOfFolder: (folderId: string) => void;
  /** 전체 보기 ↔ 즐겨찾기만 보기 */
  toggleListView: () => void;
  /** 도움말 창을 연다 (목록의 「?」 · 빈 화면 「사용 방법 보기」) */
  openHelp: () => void;
  closeHelp: () => void;
}
