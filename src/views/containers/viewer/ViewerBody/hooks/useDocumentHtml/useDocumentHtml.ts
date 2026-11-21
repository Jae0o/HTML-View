import { useEffect, useState } from "react";

import type { DocumentHtml } from "./useDocumentHtml.types";

interface ReadResult {
  handle: FileSystemFileHandle;
  /** 읽지 못했으면 null */
  html: string | null;
}

/** 문서 파일을 읽어 HTML 글자로 돌려준다. 문서 파일 하나만 읽는다 — 문서 밖 이미지 · CSS 는 불러오지 않는다 */
const useDocumentHtml = (handle: FileSystemFileHandle | undefined): DocumentHtml => {
  const [result, setResult] = useState<ReadResult | null>(null);

  useEffect(() => {
    if (!handle) return;

    let isStale = false;

    handle
      .getFile()
      .then(file => file.text())
      .then(
        html => {
          if (!isStale) setResult({ handle, html });
        },
        () => {
          if (!isStale) setResult({ handle, html: null });
        },
      );

    return () => {
      isStale = true;
    };
  }, [handle]);

  if (!handle) return { status: "error" };

  // 다른 문서를 읽은 결과가 남아 있으면 아직 읽는 중이다
  if (result?.handle !== handle) return { status: "loading" };

  return result.html === null ? { status: "error" } : { status: "ready", html: result.html };
};

export default useDocumentHtml;
