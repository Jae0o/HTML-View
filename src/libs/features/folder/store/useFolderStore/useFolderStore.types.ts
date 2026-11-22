import type { RegisteredFolder } from "../../types";

export interface FolderState {
  folders: RegisteredFolder[];
  /** 기기에 저장된 폴더를 다 불러왔는지 — 불러오기 전에는 「폴더 없음」 으로 보지 않는다 */
  isRestored: boolean;
  /** 기기에 저장된 폴더를 불러온다. 앱을 열 때 한 번 부른다 */
  restore: () => Promise<void>;
  /** 폴더 선택 창을 띄워 고른 폴더를 등록한다 */
  addFolder: () => Promise<void>;
  /** 연결이 끊긴 폴더의 읽기 권한을 다시 묻고, 받으면 다시 훑는다. 누른 자리에서 불러야 한다 */
  reconnect: (id: string) => Promise<void>;
  /** 등록을 해제한다 — 기기에 저장한 연결을 지우고 목록에서 뺀다. 폴더의 파일은 건드리지 않는다. 해제했으면 true */
  removeFolder: (id: string) => Promise<boolean>;
  /**
   * 등록 폴더의 보이는 이름을 바꾼다 — 0Docs 목록에만 쓰고 실제 폴더 이름은 건드리지 않는다.
   * 앞뒤 빈칸을 빼고, 비면 실제 폴더 이름으로 되돌린다
   */
  renameFolder: (id: string, name: string) => Promise<void>;
  /**
   * 등록 폴더 안의 폴더 하나를 목록에서 숨긴다 — 그 폴더와 아래 폴더가 빠지고, 기기에 기억한다. 숨겼으면 true.
   * 실제 폴더 · 파일은 건드리지 않는다
   */
  hidePath: (id: string, path: string) => Promise<boolean>;
  /** 숨긴 폴더를 다시 목록에 보이게 한다 — 기기에서 빼고 그 등록 폴더를 다시 훑는다 */
  showPath: (id: string, path: string) => Promise<void>;
  /** 연결된 폴더를 모두 다시 훑어 새로 생기거나 사라진 문서를 반영한다. 연결 끊긴 폴더는 건너뛴다 */
  refreshFolders: () => Promise<void>;
  /** 폴더 하나를 다시 훑는다. 읽기 권한이 풀렸으면 연결 끊김으로 바꾼다 (권한을 다시 묻지는 않는다) */
  refreshFolder: (id: string) => Promise<void>;
}
