import type { RegisteredFolder } from "../../types";

export interface FolderState {
  folders: RegisteredFolder[];
  /** 기기에 저장된 폴더를 다 불러왔는지 — 불러오기 전에는 「폴더 없음」 으로 보지 않는다 */
  isRestored: boolean;
  /** 기기에 저장된 폴더를 불러온다. 앱을 열 때 한 번 부른다 */
  restore: () => Promise<void>;
  /** 폴더 선택 창을 띄워 고른 폴더를 등록한다 */
  addFolder: () => Promise<void>;
}
