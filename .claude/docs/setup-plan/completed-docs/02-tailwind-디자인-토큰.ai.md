# 02 Tailwind 연결 · 디자인 토큰 — AI 기록

## 기준

- 브랜치 `main`, upstream `origin/main`. 기능 브랜치 규칙 대신 main 진행 — 사용자 결정 (2026-11-19, 02 시작 시 질문).
- 시작 HEAD `00351e9` (01 완료 확인: 작업 트리 clean). 미커밋.
- Node v20.20.0 (`engines >=22.12` 불일치, EBADENGINE 경고 계속).
- tailwindcss ^4.3.5 · @tailwindcss/vite ^4.3.5 · pretendard ^1.3.9 — `npm install` (플랜 명령 그대로) 로 dependencies 에 들어감.

## 자료

- `.claude/docs/setup-plan/00-실행-가이드.md` · `02-tailwind-디자인-토큰.md`
- design-system Skill v0.1.1: `references/00-시작.md` · `foundations/INDEX.md` · `principles.md` · `radius.md` · `spacing.md`
- 저장소 `CLAUDE.md` 없음

## 대조 파일

- `vite.config.ts`: `import tailwindcss from '@tailwindcss/vite'` + `plugins: [react(), tailwindcss()]`
- `src/main.tsx`: 1행에 `import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'`
- `src/index.css`: 플랜 문서의 ```css 블록을 awk 로 그대로 추출 (107줄, 수기 입력 없음)
- `src/App.tsx`: `<main className="text-base text-text-brand font-semibold">0Docs</main>`
- `package.json` · `package-lock.json`: 패키지 3개 추가

## 실행 로그 요지

- 임시 className `min-w-0 p-8 gap-12 rounded-6 h-32 px-3 rounded-lg bg-red-500 text-xl border text-base text-text-brand font-semibold` 로 build → grep 7개 모두 기대값 (woff2 92개) → App 원복 → build · lint(exit 0) 재통과 → `dist/` 삭제

## 규칙 대조 메모

- spacing 14개 + `0`(spacing 규칙 6), radius 9개 + circle `50%` · pill `99.9rem` — design-system 허용 값과 일치.
- design-system principles 는 SCSS 변수 `$color-*` 사용 · `var(--*)` 금지를 말하지만, 이 프로젝트는 Tailwind 이고 00 가이드의 디자이너 판정(Tailwind 작성 규칙 6개 O)을 따름. 토큰 정의 위치(`@theme`) 의 `var()` 는 플랜 원문.
- 글자 · 색 · 그림자 · z-index 는 design-system 에 문서 없음 → 프로토타입 값(디자이너 O 2026-11-19). `z-400` 쓰는 법 예시는 있으나 `--z-*` 토큰은 플랜 CSS 에 없음 (Tailwind z-index 는 숫자 그대로 생성).

## 확인 못 함

- 브라우저 눈 확인 (색 · 굵기 · Rendered Fonts) — 사용자 확인 항목
- 완료 조건 Vitest · Prettier — 02 범위 밖
