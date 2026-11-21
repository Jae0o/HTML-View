import { useEffect, useRef, useState } from "react";

import type { TruncatedTextLines } from "../../TruncatedText.types";

/** 글자가 실제로 잘렸는지 알려 준다 — 한 줄은 가로로, 여러 줄은 세로로 넘쳤는지 본다. 칸 크기나 글자가 바뀌면 다시 판단한다 */
const useTextTruncated = (text: string, lines: TruncatedTextLines) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 관찰을 시작할 때 한 번 불리므로 처음 판단도 여기서 한다
    const observer = new ResizeObserver(() =>
      setIsTruncated(
        lines === 1 ? element.scrollWidth > element.clientWidth : element.scrollHeight > element.clientHeight,
      ),
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [text, lines]);

  return { ref, isTruncated };
};

export default useTextTruncated;
