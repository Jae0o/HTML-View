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

/** 문서 한 개의 자리 — 등록 폴더 · 경로 · 이름으로 가리킨다 (기기에 기억할 수 있는 모양) */
export interface DocumentLocation {
  folderId: string;
  /** HTML 폴더의 경로 */
  path: string;
  /** 문서의 파일 이름 (확장자 포함) */
  fileName: string;
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

/** 검색에 맞은 등록 폴더 한 개 */
export interface FolderMatch {
  /** 맞은 HTML 폴더 · 문서만 남긴 등록 폴더 */
  folder: RegisteredFolder;
  /** 문서 이름이 맞아서 남은 HTML 폴더의 경로 — 맞은 문서가 보이도록 펼쳐서 보여 준다 */
  documentMatchedPaths: string[];
}
