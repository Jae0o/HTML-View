import { useId } from "react";

import { useViewerStore } from "@libs/features/viewer";

import { BrandLogo, Dialog, IconButton } from "@views/components/common";
import { CloseIcon } from "@views/components/icons";

import { HELP_COPY } from "./HelpDialog.constants";

/** 도움말 창 — 서비스 소개 · 사용 방법 · 카피라이트 · 문의. 목록의 「?」 와 빈 화면 「사용 방법 보기」 가 연다 */
const HelpDialog = () => {
  const isHelpOpen = useViewerStore(state => state.isHelpOpen);
  const closeHelp = useViewerStore(state => state.closeHelp);
  const titleId = useId();

  return (
    <Dialog
      open={isHelpOpen}
      width="m"
      aria-labelledby={titleId}
      onClose={closeHelp}
    >
      {/* 내용이 화면보다 길면 가운데 묶음만 스크롤한다 — 제목 줄 · 아래 줄은 늘 보인다 */}
      <div className="flex max-h-[calc(100vh-4.8rem)] flex-col">
        <div className="flex items-center justify-between gap-8 px-24 pt-20 pb-12">
          <h2
            id={titleId}
            className="m-0 text-base font-semibold"
          >
            <BrandLogo /> {HELP_COPY.title}
          </h2>
          <IconButton
            variant="ghost"
            aria-label="닫기"
            icon={<CloseIcon />}
            onClick={closeHelp}
          />
        </div>

        <div className="flex min-h-0 flex-col gap-20 overflow-y-auto px-24 pb-24">
          <p className="m-0 text-sm text-text-secondary">{HELP_COPY.about}</p>

          <section className="flex flex-col gap-8">
            <h3 className="m-0 text-base font-semibold">{HELP_COPY.howTitle}</h3>
            <ol className="m-0 flex list-none flex-col gap-8 p-0">
              {HELP_COPY.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-8 text-sm text-text-secondary"
                >
                  <span className="flex size-20 shrink-0 items-center justify-center rounded-circle bg-brand-bg-subtle font-semibold text-text-brand">
                    {index + 1}
                  </span>
                  <p className="m-0">
                    <span className="font-semibold text-text-primary">{step.title}</span> {step.description}
                  </p>
                </li>
              ))}
            </ol>
            <p className="m-0 text-sm text-text-secondary">{HELP_COPY.note}</p>
          </section>
        </div>

        <div className="flex items-center justify-between gap-8 border-t border-border-default px-24 py-12 text-sm text-text-tertiary">
          {/* 글자와 로고를 세로 가운데로 맞춘다 — 로고가 글자보다 커서 기준선에 두면 어긋난다 */}
          <span className="flex items-center gap-4">
            {HELP_COPY.copyright}
            <BrandLogo size="s" />
          </span>
          <span>
            {HELP_COPY.contactLabel}{" "}
            <a
              href={`mailto:${HELP_COPY.contactEmail}`}
              className="font-semibold text-text-brand"
            >
              {HELP_COPY.contactEmail}
            </a>
          </span>
        </div>
      </div>
    </Dialog>
  );
};

export default HelpDialog;
