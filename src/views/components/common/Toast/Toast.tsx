import { useToastStore } from "@libs/features/toast";

import { ToastMessage } from "./components";

/** 토스트가 뜨는 자리 — 앱에 한 번만 둔다. 띄울 때는 useToastStore 의 show 를 부른다 */
// 폭은 글자만큼(w-max) — 가운데 맞춤 때문에 화면 절반에서 줄바꿈되는 것을 막는다. 화면보다 길 때만 줄바꿈한다
const Toast = () => {
  const message = useToastStore(state => state.message);

  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-16 left-1/2 z-9999 w-max max-w-[calc(100vw-3.2rem)] -translate-x-1/2"
    >
      {message && <ToastMessage>{message}</ToastMessage>}
    </div>
  );
};

export default Toast;
