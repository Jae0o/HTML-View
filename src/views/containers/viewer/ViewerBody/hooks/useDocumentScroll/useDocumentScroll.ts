import { type RefObject, useEffect, useRef } from "react";

/**
 * 문서 틀이 알려 주는 스크롤 높이를 담아 둔다 — 새로고침 뒤 그 높이로 되돌린다 (결정 MD-A17).
 * 문서 틀은 앱과 다른 출처라 직접 읽지 못해, 문서 틀에 붙인 스크립트가 postMessage 로 알려 준다
 */
const useDocumentScroll = (iframeRef: RefObject<HTMLIFrameElement | null>) => {
  const scrollYRef = useRef(0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;

      const data: unknown = event.data;
      if (
        typeof data === "object" &&
        data !== null &&
        "source" in data &&
        data.source === "0docs" &&
        "scrollY" in data
      ) {
        if (typeof data.scrollY === "number") scrollYRef.current = data.scrollY;
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [iframeRef]);

  return scrollYRef;
};

export default useDocumentScroll;
