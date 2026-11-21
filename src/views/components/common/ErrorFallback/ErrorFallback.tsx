import { Button } from "../Button";
import { EmptyState } from "../EmptyState";

const reload = () => window.location.reload();

/** 화면 전체 오류 — 흰 화면 대신 보여 준다 */
const ErrorFallback = () => (
  <div className="flex min-h-screen items-center justify-center p-24">
    <EmptyState
      tone="muted"
      title="화면을 표시할 수 없습니다"
      description="잠시 뒤 다시 시도해 주세요."
      actions={
        <Button
          variant="primary"
          onClick={reload}
        >
          새로고침
        </Button>
      }
    />
  </div>
);

export default ErrorFallback;
