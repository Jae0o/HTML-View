import type { DocumentFormat, DocumentLocation } from "@libs/features/folder";

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
  /** 목록에 보일 문서 형식 — 늘 html · md 순서. 하나 이상 켜져 있다. 기기에 기억한다 (결정 MD-A2 · A4) */
  visibleFormats: DocumentFormat[];
  /** 새로고침 버튼을 누른 횟수 — 바뀌면 보던 문서를 다시 읽는다. 기억하지 않는다 */
  reloadCount: number;
  /** 도움말 창이 열려 있는지. 기억하지 않는다 — 다시 들어오면 닫혀 있다 */
  isHelpOpen: boolean;
  /**
   * 접어 둔 등록 폴더 id — 등록 폴더는 처음에 펼쳐 있다. 기억하지 않는다.
   * 줄 밖에 둬야 검색 · 형식 칩으로 줄이 잠깐 사라졌다 돌아와도 접은 상태가 남는다
   */
  collapsedFolderIds: string[];
  /**
   * 펼쳐 둔 HTML 폴더 — favoriteKey({ kind: "htmlFolder", … }) 값. HTML 폴더는 처음에 접혀 있다. 기억하지 않는다.
   * 다시 들어오면 보던 문서가 든 폴더만 펼친 채로 시작한다
   */
  expandedHtmlFolders: string[];
  /** 열기 · 접기 버튼 */
  toggleList: () => void;
  /** 목록 밖을 눌렀을 때 — 목록을 잠깐 닫는다 */
  dismissList: () => void;
  /** 문서를 고른다 — 목록을 잠깐 닫는다 */
  selectDocument: (document: DocumentLocation) => void;
  /** 보던 문서를 닫는다 — 그 문서가 든 폴더를 숨겼을 때. 목록 상태는 그대로 둔다 */
  closeDocument: () => void;
  /** 즐겨찾기를 켜고 끈다 — 켜면 맨 뒤에 붙는다 */
  toggleFavorite: (item: FavoriteItem) => void;
  /** 등록 폴더와 그 안쪽 항목의 즐겨찾기를 모두 지운다 (등록 해제 때) */
  removeFavoritesOfFolder: (folderId: string) => void;
  /** 전체 보기 ↔ 즐겨찾기만 보기 */
  toggleListView: () => void;
  /** 형식 칩 — 켜고 끈다. 켜진 것이 그 하나뿐이면 끄지 않는다 */
  toggleFormat: (format: DocumentFormat) => void;
  /** 새로고침 — 보던 문서를 파일에서 다시 읽게 한다 (결정 MD-A15)
   */
  reloadDocument: () => void;
  /** 도움말 창을 연다 (목록의 「?」 · 빈 화면 「사용 방법 보기」) */
  openHelp: () => void;
  closeHelp: () => void;
  /** 등록 폴더 줄 — 접고 편다 */
  toggleFolder: (folderId: string) => void;
  /** HTML 폴더 줄 — 접고 편다 */
  toggleHtmlFolder: (folderId: string, path: string) => void;
}
