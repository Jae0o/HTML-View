/** 문서 형식 — html HTML 문서 · md 마크다운 문서. 파일 이름 끝으로 정한다 (documentFormatOf) */
export type DocumentFormat = "html" | "md";

/** 문서 한 개 */
export interface DocumentEntry<THandle = FileSystemFileHandle> {
  /** 화면에 보이는 이름 — 확장자를 뺀 파일 이름 */
  name: string;
  /** 확장자까지 든 파일 이름. 한 폴더 안에서 문서를 가리는 값이다 (a.html 과 a.htm 은 이름이 같다) */
  fileName: string;
  handle: THandle;
}

/** 문서(HTML · MD)가 든 폴더 한 개 — 목록의 둘째 단. 이름은 HTML 만 다루던 때 그대로 둔다 */
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
  /** 숨긴 폴더를 뺀 HTML 폴더 */
  htmlFolders: HtmlFolder[];
  /** 목록에서 숨긴 폴더의 경로 — 그 폴더와 아래 폴더가 목록에서 빠진다. 숨긴 순서 */
  hiddenPaths: string[];
}

/** 기기에 저장하는 등록 폴더 */
export interface FolderRecord {
  id: string;
  name: string;
  handle: FileSystemDirectoryHandle;
  /** 등록한 때 — 순서를 바꾼 적 없는 기록은 이 값으로 줄 세운다 */
  addedAt: number;
  /**
   * 목록 순서 (0 부터). 순서를 바꾸면 모든 기록에 쓴다. 순서를 바꾸기 전에 저장한 기록 · 그 뒤 새로 등록한 기록에는 없다 —
   * 없으면 addedAt 으로 줄 세운다. addedAt(밀리초 시각)은 순서 값보다 늘 커서 새로 등록한 폴더는 맨 끝에 온다
   */
  order?: number;
  /** 목록에서 숨긴 폴더의 경로. 숨기기가 생기기 전에 저장한 기록에는 없다 — 없으면 숨긴 것이 없다 */
  hiddenPaths?: string[];
}

/** 검색에 맞은 등록 폴더 한 개 */
export interface FolderMatch {
  /** 맞은 HTML 폴더 · 문서만 남긴 등록 폴더 */
  folder: RegisteredFolder;
  /** 문서 이름이 맞아서 남은 HTML 폴더의 경로 — 맞은 문서가 보이도록 펼쳐서 보여 준다 */
  documentMatchedPaths: string[];
}
