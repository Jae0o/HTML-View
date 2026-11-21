/** 문서 한 개 */
export interface DocumentEntry<THandle = FileSystemFileHandle> {
  /** 화면에 보이는 이름 — 확장자를 뺀 파일 이름 */
  name: string;
  /** 확장자까지 든 파일 이름. 한 폴더 안에서 문서를 가리는 값이다 (a.html 과 a.htm 은 이름이 같다) */
  fileName: string;
  handle: THandle;
}

/** HTML 문서가 든 폴더 한 개 — 목록의 둘째 단 */
export interface HtmlFolder<THandle = FileSystemFileHandle> {
  /** 등록 폴더 아래 경로 (예: 플랜명 / completed). 등록 폴더 바로 아래면 빈 글자 */
  path: string;
  documents: DocumentEntry<THandle>[];
}

/** 폴더를 훑어 찾은 파일 한 개 */
export interface ScannedFile<THandle = FileSystemFileHandle> {
  /** 등록 폴더에서 이 파일까지의 폴더 이름들 */
  directories: string[];
  fileName: string;
  handle: THandle;
}

/** connected 읽을 수 있음 · disconnected 읽기 권한이 풀렸거나 폴더를 찾을 수 없음 */
export type FolderStatus = "connected" | "disconnected";

/** 등록 폴더 한 개 — 목록의 첫째 단 */
export interface RegisteredFolder {
  id: string;
  name: string;
  handle: FileSystemDirectoryHandle;
  status: FolderStatus;
  htmlFolders: HtmlFolder[];
}

/** 기기에 저장하는 등록 폴더 */
export interface FolderRecord {
  id: string;
  name: string;
  handle: FileSystemDirectoryHandle;
  /** 등록한 때 (목록 순서) */
  addedAt: number;
}
