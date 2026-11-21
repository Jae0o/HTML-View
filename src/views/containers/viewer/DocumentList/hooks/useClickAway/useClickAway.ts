import { useEffect, useRef } from "react";

/**
 * 켜져 있는 동안 상자 밖을 누르면 onAway 를 부른다.
 * 돌려주는 함수를 상자의 onPointerDown 에 건다 — 상자가 맨 위 층에 띄운 것(말줄임 펼침 · 도움말 풍선)을 눌러도 안쪽으로 센다.
 */
const useClickAway = (isActive: boolean, onAway: () => void) => {
  const isInsideRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;

    // 꺼져 있던 동안 안쪽을 누른 표시가 남아 있으면, 켜진 뒤 첫 바깥 누름을 놓친다
    isInsideRef.current = false;

    // 상자의 onPointerDown 이 먼저 불린 뒤에 여기로 온다
    const handlePointerDown = () => {
      if (!isInsideRef.current) onAway();

      isInsideRef.current = false;
    };

    // 본문 문서(iframe) 안을 누르면 누름 이벤트가 오지 않고 이 창이 포커스를 잃는다
    const handleBlur = () => {
      if (document.activeElement instanceof HTMLIFrameElement) onAway();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isActive, onAway]);

  return () => {
    isInsideRef.current = true;
  };
};

export default useClickAway;
