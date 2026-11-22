import { type RefObject, useEffect, useRef, useState } from "react";

import { documentFormatOf, inlineLocalImages, splitPath } from "@libs/features/folder";
import { useToastStore } from "@libs/features/toast";

import { DOCUMENT_RELOAD_MESSAGE } from "../../ViewerBody.constants";
import type { DocumentHtml, ReadResult } from "./useDocumentHtml.types";
import { resolveDocumentHtml } from "./useDocumentHtml.utils";

interface DocumentSource {
  /** 문서 파일 연결 — 없으면 읽을 문서가 없다 */
  handle: FileSystemFileHandle | undefined;
  /** 확장자까지 든 파일 이름 — 형식(HTML · MD)을 정한다 */
  fileName: string;
  /** 등록 폴더 연결 — 문서 안 그림 파일을 읽는다 */
  root: FileSystemDirectoryHandle | undefined;
  /** 문서가 든 폴더의 경로 (글자) — 그림 상대 경로의 기준 */
  path: string;
  /** 새로고침 버튼을 누른 횟수 — 바뀌면 같은 문서를 다시 읽는다 */
  reloadCount: number;
  /** 문서 틀이 알려 준 스크롤 높이 — 다시 읽기가 끝날 때 읽어 되돌릴 높이로 담는다 */
  scrollYRef: RefObject<number>;
}

/** 파일 글자를 문서 틀에 넣을 HTML 로 — MD 는 마크다운 모듈을 이때 처음 받아 바꾼다(첫 화면 묶음에 넣지 않는다) */
const toHtml = async (text: string, fileName: string): Promise<string> => {
  if (documentFormatOf(fileName) !== "md") return text;

  const { renderMarkdown } = await import("@libs/features/viewer/markdown");

  return renderMarkdown(text);
};

/** 그림을 넣는다 — 통째로 실패해도 그림 없이 연다 */
const withImages = async (html: string, root: FileSystemDirectoryHandle | undefined, path: string): Promise<string> => {
  if (!root) return html;

  try {
    return await inlineLocalImages(html, { root, directories: splitPath(path) });
  } catch {
    return html;
  }
};

/**
 * 문서 파일을 읽어 문서 틀에 넣을 HTML 글자로 돌려준다 — MD 는 바꾸고, 등록 폴더 안 그림 파일은 넣는다 (결정 MD-A14).
 * 같은 문서를 다시 읽을 때는 보던 내용을 그대로 두고, 끝나면 알림을 띄운다. 실패하면 보던 내용을 남기고 알림만 띄운다 (MD-A16).
 * 문서 밖 CSS 는 불러오지 않는다
 */
const useDocumentHtml = ({ handle, fileName, root, path, reloadCount, scrollYRef }: DocumentSource): DocumentHtml => {
  const [result, setResult] = useState<ReadResult | null>(null);
  const showToast = useToastStore(state => state.show);
  // 마지막으로 읽어 보여 준 문서 — 같은 문서를 다시 읽는지 가린다
  const shownHandleRef = useRef<FileSystemFileHandle | null>(null);

  useEffect(() => {
    if (!handle) return;

    let isStale = false;
    const isReload = shownHandleRef.current === handle;
    // 다른 문서로 바뀌면 담아 둔 높이를 버린다 — 맨 위에서 시작한다
    if (!isReload) scrollYRef.current = 0;

    handle
      .getFile()
      .then(file => file.text())
      .then(text => toHtml(text, fileName))
      .then(html => withImages(html, root, path))
      .then(
        html => {
          if (isStale) return;

          shownHandleRef.current = handle;
          setResult({ handle, reloadCount, html, restoreY: isReload ? scrollYRef.current : 0 });
          if (isReload) showToast(DOCUMENT_RELOAD_MESSAGE.reloaded);
        },
        () => {
          if (isStale) return;

          if (isReload) {
            // 보던 내용을 남긴다 — 「문서를 열 수 없습니다」 화면으로 바꾸지 않는다
            setResult(previous => (previous ? { ...previous, reloadCount, restoreY: scrollYRef.current } : previous));
            showToast(DOCUMENT_RELOAD_MESSAGE.reloadFailed);
            return;
          }

          shownHandleRef.current = null;
          setResult({ handle, reloadCount, html: null, restoreY: 0 });
        },
      );

    return () => {
      isStale = true;
    };
  }, [handle, fileName, root, path, reloadCount, scrollYRef, showToast]);

  return resolveDocumentHtml(result, handle, reloadCount);
};

export default useDocumentHtml;
