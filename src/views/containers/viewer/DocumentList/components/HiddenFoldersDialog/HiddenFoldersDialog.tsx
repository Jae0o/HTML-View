import { useId } from "react";

import { Button, Dialog, IconButton } from "@views/components/common";
import { CloseIcon } from "@views/components/icons";

import { ROOT_FOLDER_LABEL } from "../../DocumentList.constants";

interface HiddenFoldersDialogProps {
  open: boolean;
  /** 등록 폴더의 보이는 이름 */
  folderName: string;
  /** 그 등록 폴더에서 숨긴 폴더의 경로 — 숨긴 순서 */
  hiddenPaths: string[];
  /** 「다시 보이기」 — 그 경로를 다시 목록에 보이게 한다 */
  onShow: (path: string) => void;
  /** 닫기 버튼 · Esc */
  onClose: () => void;
}

/** 숨긴 폴더 창 — 등록 폴더 하나에서 숨긴 폴더를 보여 주고, 줄마다 다시 보이게 한다. 등록 폴더 ⋯ 메뉴 「숨긴 폴더」 가 연다 */
const HiddenFoldersDialog = ({ open, folderName, hiddenPaths, onShow, onClose }: HiddenFoldersDialogProps) => {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Dialog
      open={open}
      width="m"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onClose}
    >
      {/* 숨긴 폴더가 많아 화면보다 길면 목록만 스크롤한다 — 제목 줄은 늘 보인다 */}
      <div className="flex max-h-[calc(100vh-4.8rem)] flex-col gap-24 p-24">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-8">
            <h2
              id={titleId}
              className="m-0 text-base font-semibold"
            >
              숨긴 폴더
            </h2>
            <IconButton
              variant="ghost"
              aria-label="닫기"
              icon={<CloseIcon />}
              onClick={onClose}
            />
          </div>
          <p
            id={descriptionId}
            className="m-0 text-sm text-text-secondary"
          >
            {folderName} 에서 숨긴 폴더입니다. 실제 폴더와 파일은 그대로입니다.
          </p>
        </div>

        <ul className="m-0 flex min-h-0 list-none flex-col overflow-y-auto p-0">
          {hiddenPaths.map(path => (
            <li
              key={path}
              className="flex min-h-[3.6rem] items-center justify-between gap-8 border-b border-border-subtle py-8"
            >
              <span className="min-w-0 text-base break-all">{path || ROOT_FOLDER_LABEL}</span>
              <Button
                variant="text"
                onClick={() => onShow(path)}
              >
                다시 보이기
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Dialog>
  );
};

export default HiddenFoldersDialog;
