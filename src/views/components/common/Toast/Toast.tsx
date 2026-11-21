import { useState } from "react";

import { useToastStore } from "@libs/features/toast";

import { ToastMessage } from "./components";

import clsx from "clsx";

/** 토스트가 뜨는 자리 — 앱에 한 번만 둔다. 띄울 때는 useToastStore 의 show 를 부른다 */
// 폭은 글자만큼(w-max) — 가운데 맞춤 때문에 화면 절반에서 줄바꿈되는 것을 막는다. 화면보다 길 때만 줄바꿈한다
const Toast = () => {
  const message = useToastStore(state => state.message);
  // 사라지는 동안에도 글자가 남아 있어야 한다 — 마지막 글자를 들고 있다가 사라짐이 끝나면 비운다
  const [shownMessage, setShownMessage] = useState(message);
  const open = message !== null;

  if (message !== null && message !== shownMessage) setShownMessage(message);

  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-16 left-1/2 z-9999 w-max max-w-[calc(100vw-3.2rem)] -translate-x-1/2"
    >
      {shownMessage !== null && (
        // 아래에서 올라오며 나타나고, 내려가며 사라진다. 움직임 줄이기 설정이면 흐려지기만 한다
        <div
          className={clsx(
            "transition-[opacity,translate,visibility] duration-200 starting:opacity-0 motion-safe:starting:translate-y-8",
            !open && "invisible opacity-0 motion-safe:translate-y-8",
          )}
          onTransitionEnd={() => {
            if (!open) setShownMessage(null);
          }}
        >
          <ToastMessage>{shownMessage}</ToastMessage>
        </div>
      )}
    </div>
  );
};

export default Toast;
