import { type DocumentEntry, type DocumentLocation, type RegisteredFolder, findDocument } from "@libs/features/folder";

// 틀에 글자로 넣은 문서(srcDoc)의 링크는 이 앱의 주소를 기준으로 풀린다 — 그대로 두면 같은 문서 안 이동(#…)까지 틀 안에 이 앱을 연다.
// 문서 끝에 붙이는 스크립트가 링크 누름을 대신 처리한다:
// 같은 문서 안 이동(#…)은 그 자리로 스크롤하고, 바깥 주소(http · https)는 새 탭으로 열고, 나머지 링크는 막는다
const LINK_GUARD = `<script>document.addEventListener("click",function(e){var a=e.target.closest?e.target.closest("a[href]"):null;if(!a)return;var h=a.getAttribute("href");e.preventDefault();if(h.charAt(0)==="#"){var id=decodeURIComponent(h.slice(1));var t=id?document.getElementById(id)||document.getElementsByName(id)[0]:document.documentElement;if(t)t.scrollIntoView();return}if(/^https?:/i.test(h))window.open(h,"_blank","noopener")},true)</script>`;

/** 문서 HTML 뒤에 링크 지킴 스크립트를 붙인다 */
export const withLinkGuard = (html: string): string => html + LINK_GUARD;

/**
 * 본문에 보여 줄 화면.
 * unsupported 폴더를 열 수 없는 브라우저 · restoring 저장된 폴더를 불러오는 중 · noFolder 등록 폴더 없음 ·
 * disconnected 폴더 연결 끊김 · noSelection 문서를 고르지 않음 · document 문서 · missing 고른 문서를 찾지 못함
 */
export type BodyView =
  | { kind: "unsupported" | "restoring" | "noFolder" | "noSelection" }
  | { kind: "disconnected" | "missing"; folderId: string }
  | { kind: "document"; document: DocumentEntry };

interface BodyViewInput {
  isSupported: boolean;
  isRestored: boolean;
  folders: RegisteredFolder[];
  selectedDocument: DocumentLocation | null;
}

/** 지금 상태에서 본문에 보여 줄 화면을 고른다 — 위에서부터 먼저 맞는 것 */
export const resolveBodyView = ({ isSupported, isRestored, folders, selectedDocument }: BodyViewInput): BodyView => {
  if (!isSupported) return { kind: "unsupported" };
  if (!isRestored) return { kind: "restoring" };

  // 고른 문서의 등록 폴더가 남아 있으면 그 문서가 먼저다. 폴더가 등록 해제됐으면 고르지 않은 것으로 본다
  const selectedFolder = selectedDocument && folders.find(folder => folder.id === selectedDocument.folderId);

  if (selectedDocument && selectedFolder) {
    if (selectedFolder.status === "disconnected") return { kind: "disconnected", folderId: selectedFolder.id };

    const document = findDocument(folders, selectedDocument);

    return document ? { kind: "document", document } : { kind: "missing", folderId: selectedFolder.id };
  }

  if (folders.length === 0) return { kind: "noFolder" };

  // 읽을 수 있는 폴더가 하나라도 있으면 문서를 고르라고 안내하고, 전부 끊겼으면 첫 폴더를 다시 연결하게 한다
  const connected = folders.some(folder => folder.status === "connected");

  return connected ? { kind: "noSelection" } : { kind: "disconnected", folderId: folders[0].id };
};
