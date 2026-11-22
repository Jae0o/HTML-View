import { type RefObject, useEffect, useRef } from "react";

/** 숨김 → 보임 전환(visibility)이 끝날 때까지 기다리는 최대 프레임 — 전환 200ms 보다 넉넉히 */
const MAX_FRAMES = 20;

/**
 * 목록 상자가 열리고 닫힐 때 키보드 포커스를 옮긴다 — 누른 버튼이 숨으며 포커스가 사라지지 않게 (결정 D4).
 * 열리면 상자 안 「목록 접기」 로, 닫히면 「목록 열기」 로 옮긴다.
 * 닫힐 때는 포커스가 상자 안에 있었거나 사라졌을 때만 옮긴다 — 본문 문서를 눌러 닫았으면 그대로 둔다.
 * 목록을 그리기 전(저장된 폴더를 불러오는 중)의 변화는 세지 않는다 — 처음 열릴 때 포커스를 가져가지 않는다
 */
const useListFocus = (
  isRendered: boolean,
  isListVisible: boolean,
  surfaceRef: RefObject<HTMLElement | null>,
  openButtonsRef: RefObject<HTMLElement | null>,
) => {
  const wasVisibleRef = useRef(isListVisible);

  useEffect(() => {
    const wasVisible = wasVisibleRef.current;
    wasVisibleRef.current = isListVisible;

    if (!isRendered || wasVisible === isListVisible) return;

    const isFocusInList =
      document.activeElement === document.body || surfaceRef.current?.contains(document.activeElement);
    if (!isListVisible && !isFocusInList) return;

    const target = isListVisible
      ? surfaceRef.current?.querySelector<HTMLButtonElement>('button[aria-label="목록 접기"]')
      : openButtonsRef.current?.querySelector<HTMLButtonElement>('button[aria-label="목록 열기"]');
    if (!target) return;

    // 숨겨 둔 버튼은 보이기 시작한 뒤에야 포커스를 받는다 — 받을 때까지 프레임마다 다시 시도한다
    let frame = 0;
    let remaining = MAX_FRAMES;
    const tryFocus = () => {
      target.focus();
      remaining -= 1;
      if (document.activeElement !== target && remaining > 0) frame = requestAnimationFrame(tryFocus);
    };
    frame = requestAnimationFrame(tryFocus);

    return () => cancelAnimationFrame(frame);
  }, [isRendered, isListVisible, surfaceRef, openButtonsRef]);
};

export default useListFocus;
