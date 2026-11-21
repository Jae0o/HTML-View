import { useEffect, useRef, useState } from "react";

/** 한 줄 글자가 실제로 잘렸는지 알려 준다. 칸 폭이나 글자가 바뀌면 다시 판단한다 */
const useTextTruncated = (text: string) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 관찰을 시작할 때 한 번 불리므로 처음 판단도 여기서 한다
    const observer = new ResizeObserver(() => setIsTruncated(element.scrollWidth > element.clientWidth));
    observer.observe(element);

    return () => observer.disconnect();
  }, [text]);

  return { ref, isTruncated };
};

export default useTextTruncated;
