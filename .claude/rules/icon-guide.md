---
paths:
  - src/views/components/icons/**
  - src/**/*.tsx
---

# 아이콘 컨벤션

## 핵심 원칙

1. **외부 아이콘 패키지 금지** — `react-icons`, `lucide-react`, `@heroicons/react` 등을 설치하거나
   import 하지 않는다. 모든 아이콘은 `views/components/icons/` 에 SVG 컴포넌트로 직접 구현한다.
   _(import 는 ESLint `no-restricted-imports` 가 차단)_
2. **아이콘은 색을 갖지 않는다** — `stroke="currentColor"` 고정. 색은 소비처(부모)가 결정한다.
3. **크기는 `size` prop 하나** — 정사각 전제. `width`/`height` 를 따로 받지 않는다.
4. **픽셀 격자에 맞춘다** — DPR 1 에서 획이 번지지 않도록 렌더 박스·path 좌표를 정렬한다. 상세는 아래 "픽셀 격자" 절.

---

## 파일 구조

```
views/components/icons/
├── index.ts                     # 의무 barrel — 모든 아이콘 + types 재노출
├── types/
│   ├── icon.types.ts            # IconCommonProps
│   └── index.ts
└── {Name}Icon/
    ├── {Name}Icon.tsx
    └── index.ts
```

- 폴더·파일명은 **PascalCase + `Icon` 접미사**. `Check` 가 아니라 `CheckIcon`.
- 스타일 파일(`.css`)을 두지 않는다. 아이콘은 스타일을 갖지 않고 부모가 제어한다.
- `index.ts` 는 `export { default as {Name}Icon } from "./{Name}Icon";` 한 줄.
- 영역 루트 `icons/index.ts` 에 `export * from "./{Name}Icon";` 을 **알파벳 순**으로 추가한다.
  마지막 줄은 `export * from "./types";`.

---

## 타입

```ts
// views/components/icons/types/icon.types.ts
import type { SVGProps } from "react";

export interface IconCommonProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}
```

아이콘별 전용 props 를 만들지 않는다. 모든 아이콘이 `IconCommonProps` 하나만 받는다.

---

## 구현 템플릿

```tsx
import type { IconCommonProps } from "../types";

// 출처: Figma `check` (원본 출처를 주석으로 남긴다)
const CheckIcon = ({ size = 20, ...rest }: IconCommonProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="m20 6-11 11-5-5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CheckIcon;
```

**규칙**:

| 항목                               | 값                                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 선언                               | arrow function + `export default` (named export 금지)                                                  |
| `size` 기본값                      | 그 아이콘을 가장 많이 쓰는 치수(원본 viewBox 와 같을 필요는 없다). 정할 근거가 없으면 `20`             |
| `size` 타입                        | `number`(px) 와 `string`(`"1.8rem"`) 둘 다 허용                                                        |
| 속성 위치                          | **원본 asset 구조 그대로** — stroke 속성이 path 레벨에 있으면 그대로 둔다 (svg 루트로 재배치하지 않음) |
| `viewBox`                          | 원본 소스 그대로 유지 (`0 0 20 20` / `0 0 24 24` 혼용 가능) — 렌더 박스 치수는 "픽셀 격자" 절로 검증   |
| `fill`                             | `"none"` + stroke 기반이 기본. 채움 아이콘만 `fill="currentColor"`                                     |
| `stroke`                           | 색 값만 `"currentColor"` 로 치환 — hex/변수 하드코딩 금지                                              |
| `strokeWidth`                      | 원본 값 기준 — DPR 1 에서 번지면 "픽셀 격자" 절에 따라 조정                                            |
| `strokeLinecap` / `strokeLinejoin` | 원본 값 그대로 유지                                                                                    |
| `{...rest}`                        | **항상 마지막** — 소비처가 모든 속성을 override 할 수 있어야 한다                                      |
| 출처 주석                          | **신규 아이콘은 필수** — 원본 세트·이름을 상단 주석으로. 기존 것은 그 아이콘을 손볼 때 채운다          |

> `{...rest}` 를 속성 목록 앞에 두면 `className`·`stroke` override 가 먹지 않는다. 반드시 마지막.

> **같은 아이콘을 여러 치수로 쓰면 호출부가 모두 `size` 를 적는다.** 한 곳이라도 생략해 기본값에
> 기대고 있으면, 다른 화면의 시안이 바뀌어 기본값을 고칠 때 그 자리가 조용히 따라 움직인다.
> 예외는 `Button` 의 `icon` prop — 거기서 생략은 "버튼 크기에 맞춰라"는 지시다(아래 "Button 과의 계약").

---

## 픽셀 격자 (DPR 1 번짐 방지)

새 SVG 아이콘을 넣거나 기존 아이콘의 크기·획을 바꿀 때 적용한다.

**DPR 1 디스플레이(1080p/1440p 외장 모니터)에서만 드러나는 문제다.** 맥북 내장 레티나에서는
물리 픽셀이 4배라 어긋남이 뭉개져 안 보인다. 사용자는 외장 모니터를 많이 써서, 만든 사람
화면에서 멀쩡한 아이콘이 사용자 화면에서 번지거나 지글거린다.

**Figma export 를 그대로 믿지 않는다** — 위 "원본 asset 그대로" 규칙은 **path 모양**에 대한
것이고(임의로 새 아이콘을 그리지 말라는 뜻), 렌더 박스 치수와 stroke 두께는 픽셀 격자 검증을
거친다. export 치수는 격자를 보장하지 않는다 — 스크롤 힌트 화살표는 레이어 박스 42×18 에
stroke 삐져나온 0.5씩이 더해져 우연히 홀수 43×19 가 됐다.

### 체크 3가지

**1. 렌더 박스는 짝수로** — **센터링되는 아이콘의 폭이 홀수면 반드시 반 픽셀이 남는다**
(`x = 중심 - 폭/2`). 실측으로 폭 43 → `x=378.5`, 폭 44 → `x=378.0` 이었고 이 차이가 눈에 보였다.
`left: 50%` + `translate: -50%` 나 flex 센터링을 쓰는 아이콘이면 특히 확인한다.

**2. path 좌표를 stroke 절반 격자에 맞춘다** — 획 가장자리가 픽셀 경계에 닿아야 또렷하다.
stroke 1.5 면 좌표를 `0.75` 격자에, stroke 1 이면 `0.5` 격자에 스냅한다.

```
stroke 1.5 → M0.75 0.75L22 19.25L43.25 0.75   (박스 44x20 에 정확히 들어맞음)
```

**3. 움직이는 아이콘은 이동량을 정수 픽셀로** — 이징은 `translateY(9.84875px)` 같은 중간값을
만들고, 그러면 **프레임마다 안티에일리어싱이 달라져** 선이 떨린다. `steps()` 로 끊는다. 절대
위치가 정수일 필요는 없고 **프레임 간 변화량**만 정수면 된다. 이동 거리와 스텝 수는 짝이다
(1rem 이동 ↔ `steps(10)` = 한 스텝 1px). 한쪽만 바꾸면 조용히 깨지므로 양쪽에 주석을 남긴다.

### 얇은 획이 문제면 굵기를 올린다 — 크기가 아니라

1px 획은 전체가 안티에일리어싱이라 위치가 흔들리면 잉크 전량이 흔들린다. 1.5 면 꽉 찬 코어
픽셀이 생겨 변동 폭이 크게 줄어든다. **아이콘을 키우는 건 도움이 안 된다** — 대각선만 길어져
지글거리는 픽셀 수가 늘어난다.

### 하지 말 것

- **PNG 로 바꾸지 않는다.** 포맷은 레버가 아니다. 실제로 시도해봤고 개선의 원인은 포맷이
  아니라 같이 들어간 격자정렬·짝수 폭이었다. PNG 는 `currentColor` 테마 대응·크기 유연성을
  잃고 @1x/@2x 관리가 붙으며, 소수점 위치에서는 벡터보다 더 나쁘다.
- **`canvas.drawImage(svgImage, ...)` 로 검증하지 않는다.** SVG 를 이미지로 한 번 래스터한 뒤
  리샘플링한 값이라, DOM 안 인라인 SVG 의 실제 래스터와 다르다. 이 프록시를 믿고 맞는 가설을
  한 번 뒤집었다가 되돌린 적이 있다.

### 검증 방법

1. 실제 DOM 에 넣고 `getBoundingClientRect()` 로 좌표를 재서 정수인지 확인
2. **뷰포트를 스크린샷 크기에 맞춘 1:1 스크린샷**으로 본다 — 축소된 스크린샷은 1px 차이가 사라진다
3. 최종 확인은 DPR 1 모니터에서 사람 눈으로. 개발자 화면(레티나)에서는 판단할 수 없다

### 화면 획 굵기

아이콘 획은 화면 기준 1 ~ 1.5px 로 둔다 (`vectorEffect="non-scaling-stroke"` 로 크기와 상관없이 고정).
같은 줄에 나란히 놓이는 아이콘은 같은 굵기로 맞춘다 — 오른쪽 위 문서 버튼(새로고침 · 다운로드)과
목록 줄 문서 아이콘(HTML · MD)은 1px, 그 밖의 버튼 아이콘은 1.5px.
1px 은 직선을 0.5 격자에 맞출 수 있을 때 쓴다 — 대각선 · 곡선은 번짐을 감수한다(위 「얇은 획이 문제면 굵기를 올린다」 와 함께 본다).

---

## 소비 방법

```tsx
import { ChevronDownIcon, PlusIcon } from "@views/components/icons";

// 기본 크기(20)
<PlusIcon />

// rem 지정 — 아이콘이 자기 크기를 완전히 소유
<ChevronDownIcon size="1.6rem" />

// 색은 부모가 결정 (currentColor 상속)
<span style={{ color: "..." }}><PlusIcon /></span>
```

색을 줄 때 아이콘에 직접 `stroke` 를 넘기지 않고, **부모의 `color` 로 상속**시킨다.
Tailwind 예: `<span className="text-text-secondary"><PlusIcon /></span>` — 색은 부모 클래스로 둔다.

---

## Button 과의 계약

공통 `Button` 은 `icon` prop 으로 받은 엘리먼트를 `resolveIcon` 으로 가로채 크기를 주입한다.
아이콘을 Button 에 넘길 때 이 동작을 전제로 한다. (Button 은 공통 컴포넌트 작업에서 이 계약대로 만든다.)

| 넘긴 아이콘의 `size`  | Button 의 처리                                                              |
| --------------------- | --------------------------------------------------------------------------- |
| 미지정 (`undefined`)  | `cloneElement` 로 버튼 size 별 크기 주입 — **크기는 Button 이 정한다. 값은 `design-system.md` → Skill** (디자인 시스템 규칙 대기) |
| `number`              | 아이콘은 그대로, **래퍼에 `{size / 10}rem`** 크기 지정                      |
| `string` (`"1.8rem"`) | 손대지 않음 — 아이콘이 자기 크기를 완전히 소유                              |

```tsx
// 버튼 size 에 맞춰 자동 조정되게 — size 를 넘기지 않는다 (권장)
<Button icon={<PlusIcon />} size="m">폴더 추가</Button>

// 아이콘 크기를 고정해야 할 때만 명시
<Button icon={<PlusIcon size="1.8rem" />} />
```

---

## 신규 아이콘 추가 절차

1. Figma 의 실제 SVG asset 을 export 해 **그대로 사용**한다. path 를 추측·근사해 그리지 않는다.
2. 이미 같은 역할의 아이콘이 있는지 `icons/index.ts` 를 먼저 확인한다.
   path 가 미세하게 다른 정도면 **기존 것을 재사용**하고 새로 만들지 않는다.
3. `{Name}Icon/{Name}Icon.tsx` + `index.ts` 를 위 템플릿대로 생성한다.
4. `icons/index.ts` 에 알파벳 순으로 `export * from "./{Name}Icon";` 추가.
5. 하드코딩된 색·`width`/`height` 개별 지정·`fill` 에 hex 가 남아 있지 않은지 확인한다.

---

## 금지사항

| 금지                                            | 올바른 방법                                                          |
| ----------------------------------------------- | -------------------------------------------------------------------- |
| `import { FaPlus } from "react-icons/fa"`       | `import { PlusIcon } from "@views/components/icons"` _(ESLint 강제)_ |
| `stroke="#7c3aed"` / `stroke` 에 색 값 · 토큰 직접 지정 | `stroke="currentColor"` + 부모에서 `color` 지정              |
| `width`/`height` 를 개별 prop 으로 받기         | `size` 하나                                                          |
| `{...rest}` 를 속성 앞에 배치                   | 항상 마지막                                                          |
| 아이콘 폴더에 스타일 파일 생성                  | 스타일은 소비처가 소유                                               |
| `Check`, `IconCheck` 등 접미사 없는/앞선 네이밍 | `CheckIcon`                                                          |
| 아이콘별 전용 props 인터페이스                  | `IconCommonProps` 공용                                               |
| 여러 치수로 쓰는 아이콘을 `size` 없이 렌더      | 호출부가 모두 명시 (`Button` 의 `icon` prop 은 예외)                 |
| 역할이 겹치는 아이콘 중복 생성                  | 기존 아이콘 재사용                                                   |
