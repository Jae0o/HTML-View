import { useId } from "react";

import type { LogoMarkProps } from "./LogoMark.types";

/** 로고 마크 「접힌 0」 — 0 의 오른쪽 위 모서리가 종이처럼 접혀 있다 */
const LogoMark = ({ size = 20, className }: LogoMarkProps) => {
  // 한 화면에 마크가 여러 개 있어도 잘라내기 영역 이름이 겹치지 않게 한다
  const clipId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M0 0H12.5V2L19.5 9V24H0z" />
        </clipPath>
      </defs>
      <path
        clipPath={`url(#${clipId})`}
        fillRule="evenodd"
        d="M12 2a7.5 7.5 0 0 1 7.5 7.5v5a7.5 7.5 0 0 1 -15 0v-5a7.5 7.5 0 0 1 7.5 -7.5zM12 6.5a3 3 0 0 1 3 3v5a3 3 0 0 1 -6 0v-5a3 3 0 0 1 3 -3z"
        className="fill-brand-bg"
      />
      <path
        d="M12.5 2L19.5 9H13.5a1 1 0 0 1 -1 -1z"
        className="fill-brand-bg-active"
      />
    </svg>
  );
};

export default LogoMark;
