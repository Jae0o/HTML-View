# 02 Tailwind 연결 · 디자인 토큰

## 목표

Tailwind v4 를 연결하고, 간격 · 둥글기 · 글자 · 색 · 그림자는 디자인 시스템 허용 값과 프로토타입 확정 값만 클래스로 만들어지게 토큰을 건다. 이 다섯 종류의 허용 밖 클래스(`px-3`, `rounded-lg`, `bg-red-500` 등)는 생기지 않는다.

테마로 막을 수 없는 클래스(`p-px` · `border-2` · `rounded-full` · 대괄호 px 등)와 그 밖의 Tailwind 기본 값은 실행 가이드 「쓰지 않는 클래스」로 막는다.

## 기준

- `design-system` Skill: 단위(1rem = 10px), 간격 허용 값 14개, 둥글기 허용 값.
- 프로토타입 값 (`claude/HTML 뷰어 디자인 기준.tmp.md`): 글자 두 단계, 그린 톤 색, 떠 있는 상자 그림자, 겹침 순서. 디자이너 O (2026-11-19).
- 클래스 숫자 = px 값이 되게 이름을 붙인다. 예: `p-8` = 8px, `rounded-6` = 6px.
- 셋업 결정 4-A (글꼴 npm 배포) · 5-A (테두리 `0.1rem`) · 6-A (색 이름 그대로) · 7-A (로고 16px 예외) 반영.

## 단계

1. `npm install tailwindcss @tailwindcss/vite pretendard` 후 `vite.config.ts` 의 plugins 에 `tailwindcss()` 를 더한다.
2. `src/main.tsx` 맨 위, `./index.css` import 보다 앞에 글꼴 불러오기 한 줄을 넣는다. 쓰는 글자 조각만 내려받는 방식이다.

```ts
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
```

3. `src/index.css` 를 아래 내용으로 채운다. 값을 더하거나 빼지 않는다. 코드 정렬(03) 결과와 같은 모양으로 적어 두었다 — 따옴표 · 줄바꿈도 그대로 쓴다.
4. `src/App.tsx` 의 빈 화면 글자에 `text-base text-text-brand font-semibold` 를 줘서 연결을 확인한다.

```css
@import 'tailwindcss';

/*
 * 기준 우선순위: design-system Skill > 제품 스타일 시스템 > 첨부 디자인 기준 MD
 * 단위: html 62.5% — 1rem = 10px. 클래스 숫자는 px 값이다 (p-8 = 8px).
 * 기본 토큰을 모두 지우고 허용 값만 다시 건다. 목록에 없는 값은 클래스가 생기지 않는다.
 */
@theme {
  /* 테두리 기본 두께 — Tailwind 기본 1px 대신 rem 표기 (결정 5-A). 화면 결과는 같다 */
  --default-border-width: 0.1rem;

  /* 간격 · 안쪽 여백 · 바깥 여백 · 너비 · 높이 — design-system spacing 허용 값 14개 */
  --spacing-*: initial;
  --spacing-0: 0; /* 0 은 제한 없이 쓴다 (spacing 규칙 6) — 없으면 min-w-0 · p-0 · inset-0 이 안 생긴다 */
  --spacing-2: 0.2rem;
  --spacing-4: 0.4rem;
  --spacing-6: 0.6rem;
  --spacing-8: 0.8rem;
  --spacing-10: 1rem;
  --spacing-12: 1.2rem;
  --spacing-14: 1.4rem;
  --spacing-16: 1.6rem;
  --spacing-20: 2rem;
  --spacing-24: 2.4rem;
  --spacing-32: 3.2rem;
  --spacing-40: 4rem;
  --spacing-48: 4.8rem;
  --spacing-64: 6.4rem;

  /* 둥글기 — design-system radius 허용 값. 원형 50%, 알약 99.9rem */
  --radius-*: initial;
  --radius-2: 0.2rem;
  --radius-4: 0.4rem;
  --radius-6: 0.6rem;
  --radius-8: 0.8rem;
  --radius-10: 1rem;
  --radius-12: 1.2rem;
  --radius-16: 1.6rem;
  --radius-20: 2rem;
  --radius-24: 2.4rem;
  --radius-circle: 50%;
  --radius-pill: 99.9rem;

  /* 글자 — 두 단계만 (프로토타입 확정). 로고 글자는 예외 (결정 7-A) */
  --text-*: initial;
  --text-base: 1.3rem;
  --text-base--line-height: 2rem;
  --text-sm: 1.2rem;
  --text-sm--line-height: 1.8rem;
  --text-logo: 1.6rem;
  --text-logo--line-height: 2rem;

  --font-sans:
    'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont,
    'Apple SD Gothic Neo', 'Segoe UI', 'Malgun Gothic', sans-serif;

  /* 색 — 무채색은 제품 스타일 시스템 라이트 테마, 대표색만 그린 톤 */
  --color-*: initial;
  --color-bg-canvas: #ffffff;
  --color-bg-subtle: #fafafa;
  --color-bg-inverse: #09090b;
  --color-bg-overlay: rgba(9, 9, 11, 0.48);
  --color-surface-default: #ffffff;
  --color-surface-hover: #f4f4f5;
  --color-surface-active: #ececee;
  --color-text-primary: #09090b;
  --color-text-secondary: #52525b;
  --color-text-tertiary: #71717a;
  --color-text-inverse: #ffffff;
  --color-text-placeholder: #bdbdbd;
  --color-text-brand: #047857;
  --color-border-default: #e4e4e7;
  --color-border-subtle: #ececee;
  --color-brand-bg-subtle: #ecfdf5;
  --color-brand-bg-muted: #d1fae5;
  --color-brand-bg: #10b981;
  --color-brand-bg-hover: #059669;
  --color-brand-bg-active: #047857;
  --color-brand-fg: #ffffff;
  --color-favorite-on: #fdd835;
  --color-danger-bg: #ef4444;
  --color-danger-bg-hover: #dc2626;

  /* 떠 있는 것 공통 그림자 — 말줄임 펼침 문서 값 */
  --shadow-*: initial;
  --shadow-float: 0 0.4rem 0.8rem #0000000a, 0 1.2rem 2.4rem #00000014;
}

@layer base {
  html {
    font-size: 62.5%;
  }
  body {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--text-base--line-height);
    font-weight: 400;
    color: var(--color-text-primary);
    background: var(--color-bg-canvas);
  }
  :focus-visible {
    outline: 0.2rem solid var(--color-text-primary);
    outline-offset: 0.2rem;
    border-radius: 0.2rem;
  }
}
```

## 쓰는 법 (다음 단계 참고)

| 쓰임 | 클래스 예 |
|---|---|
| 간격 · 여백 | `gap-8` `p-12` `px-16` `mt-24` |
| 높이 · 아이콘 크기 | `h-32` `size-20` `size-16` |
| 허용 값에 없는 너비 | `w-[36rem]` — rem 으로만, px 금지 |
| 둥글기 | `rounded-6` `rounded-12` `rounded-pill` `rounded-circle` |
| 글자 | `text-base` `text-sm` `font-semibold` |
| 색 | `bg-surface-default` `text-text-secondary` `border-border-default` |
| 테두리 | `border` (0.1rem) `border-b` |
| 그림자 · 겹침 | `shadow-float` `z-400` |

## 확인

명령으로 확인한다. 확인이 끝나면 App 클래스를 단계 4의 `text-base text-text-brand font-semibold` 만 남기고 나머지 임시 클래스는 지운다.

```bash
# App.tsx 에 임시: className="min-w-0 p-8 gap-12 rounded-6 h-32 px-3 rounded-lg bg-red-500 text-xl border text-base text-text-brand font-semibold"
npm run build
grep -oE '\.(p-8|gap-12|rounded-6|h-32|px-3|rounded-lg|bg-red-500|text-xl)\{' dist/assets/*.css   # 기대: .p-8{ .gap-12{ .rounded-6{ .h-32{ 네 개만
grep -oE '\.border\{[^}]*\}' dist/assets/*.css                                                 # 기대: border-width:.1rem
grep -o 'html{font-size:62.5%}' dist/assets/*.css                                                # 기대: 한 줄
grep -oE -- '--text-base:[^;]*' dist/assets/*.css                                               # 기대: --text-base:1.3rem
grep -oE '\.min-w-0\{[^}]*\}' dist/assets/*.css                                            # 기대: min-width:var(--spacing-0)
grep -c 'Pretendard Variable' dist/assets/*.css                                                  # 기대: 1 이상
ls dist/assets/*.woff2 | wc -l                                                                   # 기대: 1 이상 (글꼴 조각 파일)
```

- [ ] 위 명령 결과가 기대와 같다
- [ ] `npm run build` · `npm run lint` 통과

### 사용자 확인 (눈으로)

- [ ] `npm run dev` 화면의 `0Docs` 글자가 작은 초록 굵은 글씨다
- [ ] 개발자 도구 Rendered Fonts 가 「Pretendard Variable」 이다
