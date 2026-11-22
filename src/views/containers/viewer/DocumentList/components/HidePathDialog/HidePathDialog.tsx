import { Fragment, useState } from "react";

import { joinPath, splitPath } from "@libs/features/folder";

import { Button, ConfirmDialog } from "@views/components/common";

interface HidePathDialogProps {
  /** 숨기기를 누른 줄의 경로 — 폴더가 둘 이상 이어진 경로 */
  path: string;
  /** 고른 폴더까지의 경로를 받아 숨긴다 */
  onHide: (path: string) => void;
  onCancel: () => void;
}

/**
 * 숨길 폴더 고르기 창 — 줄의 경로를 폴더 단위 버튼으로 나눠 하나를 고른다.
 * 처음에는 맨 끝(그 줄 자신)이 골라져 있다. 중간 폴더를 고르면 그 아래가 모두 숨겨진다.
 * 열 때만 그린다(부르는 쪽이 붙였다 뗀다) — 줄마다 닫힌 창을 두지 않고, 열 때마다 맨 끝을 고른 채로 시작한다
 */
const HidePathDialog = ({ path, onHide, onCancel }: HidePathDialogProps) => {
  const names = splitPath(path);
  const [pickedCount, setPickedCount] = useState(names.length);

  return (
    <ConfirmDialog
      open
      title="어느 폴더를 숨길까요?"
      description="고른 폴더와 그 안의 폴더가 목록에서 빠집니다. 실제 파일은 그대로입니다."
      confirmLabel="숨기기"
      onConfirm={() => onHide(joinPath(names.slice(0, pickedCount)))}
      onCancel={onCancel}
    >
      <div
        role="group"
        aria-label="숨길 폴더"
        className="flex flex-wrap items-center gap-4"
      >
        {names.map((name, index) => (
          // 경로 안에 같은 이름이 또 나올 수 있어 자리까지 키에 넣는다
          <Fragment key={`${index}-${name}`}>
            {index > 0 && (
              <span
                aria-hidden="true"
                className="text-sm text-text-tertiary"
              >
                /
              </span>
            )}
            {/* 공용 버튼은 줄을 바꾸지 않는다 — 긴 이름 하나가 창 밖으로 나가지 않게 창 폭에서 말줄임한다 */}
            <Button
              variant={index + 1 === pickedCount ? "primary" : "default"}
              aria-pressed={index + 1 === pickedCount}
              title={name}
              className="max-w-full"
              onClick={() => setPickedCount(index + 1)}
            >
              <span className="min-w-0 truncate">{name}</span>
            </Button>
          </Fragment>
        ))}
      </div>
    </ConfirmDialog>
  );
};

export default HidePathDialog;
