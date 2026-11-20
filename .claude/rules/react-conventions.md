---
paths:
  - src/**/*.tsx
  - src/**/*.ts
  - src/**/*.css
---

# 0Docs React/TypeScript 개발 컨벤션

## 컴포넌트 아키텍처

**Layout → Page → Container → Component** 4단계 계층. 비즈니스 로직은 **Custom Hook으로 분리 필수**.

| 계층          | 역할                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| **Layout**    | 공통 골격 (`children`, Header/Footer, `~Layout.tsx`)                   |
| **Page**      | 화면 단위 조립 (`~Page.tsx`)                                           |
| **Container** | 로직·상태 처리 (API 호출 또는 `use~` Hook 1개 이상)                    |
| **Component** | 순수 UI (props 수신, API 호출·비즈니스 Hook 금지. UI 상태 Hook은 허용) |

---

## 폴더 구조

도메인 그룹은 모두 **소문자**. 단일 도메인에 파일이 누적되어 분류가 필요할 때 `{subDomain}/` 중간 계층(소문자, 역할 단위) 추가.

**subDomain 사용 임계 기준**: 같은 도메인 안에 의미적으로 묶이는 파일이 **2개 이상**이고 다른 그룹과 구분이 필요할 때만 `{subDomain}/` 추가. 도메인 안의 파일이 하나뿐이거나 굳이 분류할 필요가 없으면 도메인 직속 배치.

> 예: `views/components/document/list/...` 는 문서 목록 그룹으로 묶이는 컴포넌트가 여러 개 → subDomain 사용. `views/components/document/{Component}/` 처럼 별도 그룹 의미가 없는 단일 컴포넌트 → 도메인 직속.

**다중 단어 subDomain 표기**: **camelCase** (예: `recentDocument/`, `folderTree/`). 단어를 단순히 모두 소문자로 합치거나(`recentdocument`) kebab-case(`recent-document`)는 금지. 도메인명 자체도 다중 단어면 동일하게 camelCase.

**도메인 단·복수**: 단수/복수는 작성자 판단. 단, 한 영역 안에서 같은 의미의 단수형과 복수형을 동시에 쓰는 것은 금지(`documents/` 와 `document/` 공존 금지). 신규 도메인 폴더 추가 전 인접 영역의 표기를 확인하고 한쪽으로 통일한다.

```
src/
├── libs/
│   ├── constants/
│   ├── env/
│   ├── features/{domain}/                     # 도메인 비즈니스 로직 (예: folder · document)
│   │   ├── store/{useXxxStore}/               # zustand store (아래 참조)
│   │   ├── hooks/{hookName}/                  # 도메인 비즈니스 훅 (재사용)
│   │   ├── types.ts mapper.ts index.ts
│   ├── hooks/
│   │   ├── common/{hookName}/{hookName}.ts    # 도메인 무관 공용 훅
│   │   └── {domain}/{hookName}/{hookName}.ts  # 재사용 도메인 훅
│   └── types/ utils/
└── views/
    ├── layouts/
    ├── pages/{domain}/[{subDomain}/]{PageName}Page/
    ├── containers/{domain}/[{subDomain}/]{Name}/
    └── components/
        ├── common/{Component}/
        ├── icons/{Name}Icon/                  # icon-guide.md
        └── {domain}/[{subDomain}/]{Component}/
```

Page/Container는 필요 시 하위 `constants/` `providers/` `hooks/` `components/` 추가 가능. `index.ts` (barrel) 필수, `{Name}.tsx`/`.types.ts`는 같은 폴더 공존.

**Component 내부 sub-component**: Component 폴더 안에 추가 컴포넌트가 필요하면 항상 `components/{Sub}/{Sub}.tsx + index.ts` 형태로 wrap. 평탄 `.tsx` sibling(예: `DocumentCard/DeleteButton.tsx`) 금지. 그룹 폴더명은 `components/` 로 통일하고 `parts/`, `sections/` 등 의미 그룹명은 사용하지 않는다. sub-component 가 과도하게 많아지면 해당 Component 가 사실상 Container 가 아닌지 먼저 검토할 것.

**`components/` 폴더는 컴포넌트당 1번만** (중첩 금지). sub-component 가 자기만의 sub-component 를 또 갖는 패턴(`{Component}/components/{Sub}/components/{SubSub}/`) 은 허용되지 않는다. 더 세분화가 필요하면 모두 최상위 `{Component}/components/` 한 폴더에 평탄 배치한다. 이 정도로 깊어지는 Component 는 사실상 새 Component 로 승격해 별도 도메인 하위로 옮길 것을 검토.

```
{Component}/
├── {Component}.tsx
├── {Component}.types.ts
├── components/                  # sub-component 모음
│   ├── {Sub}/
│   │   ├── {Sub}.tsx
│   │   └── index.ts
│   └── index.ts                 # barrel
├── hooks/                       # 필요 시
└── index.ts
```

> 예: 모달 부품이라면 `views/components/common/{Modal}/components/{Header, Body, Footer, Portal}/` 처럼 나눈다.

**barrel `index.ts` 의무 위치**:

| 위치                                                                                                | 형식                                                                                                                 |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 도메인 루트 (`libs/features/{domain}/index.ts`)                                                     | 하위 세그먼트를 `export * from "./{seg}"`                                                                            |
| 세그먼트 (`types/`, `store/`, `hooks/`, `constants/`, `utils/`) 의 `index.ts`                        | 하위 파일/폴더를 `export * from "./{name}"`                                                                          |
| Page/Container/Component 폴더 (`{Name}/index.ts`)                                                   | `export { default as {Name} } from "./{Name}";` (+ 타입 있으면 `export * from "./{Name}.types";`)                    |
| Hook 폴더 (`{useXxx}/index.ts`)                                                                     | `export { default as {useXxx} } from "./{useXxx}";` — **named 한 줄만**. 무명 default 재노출(`export { default } from "./{useXxx}"`)은 추가하지 않는다 (`agent_rules_common` 준수) |
| subDomain 폴더 (`{subDomain}/index.ts`)                                                             | 하위 Component/Container/Page 폴더를 `export *`                                                                      |

도메인을 외부에서 사용할 때는 항상 barrel 통한 import (`from "@libs/features/{domain}"` / `from "@views/components/{domain}"`).

**Layouts 영역**: `views/layouts/` 는 도메인 구분이 없는 영역. barrel·sub-component·hook 룰은 일반 Component/Container 와 동일하게 적용. 영역 루트 `views/layouts/index.ts` (`export * from "./{Layout}"`) 도 의무 barrel. 두 Layout 이상에서 hook 을 공유하면 `libs/hooks/{domain or common}/` 으로 승격.

```
views/layouts/
├── index.ts                       # 의무 barrel
└── {LayoutName}/
    ├── {LayoutName}.tsx
    ├── index.ts                   # 의무 barrel
    ├── components/                # sub-component 필요 시
    │   ├── {Sub}/
    │   │   ├── {Sub}.tsx
    │   │   └── index.ts
    │   └── index.ts
    └── hooks/                     # hook 필요 시
        ├── use{Xxx}/
        │   ├── use{Xxx}.ts
        │   └── index.ts
        └── index.ts
```

---

## 커스텀 훅

네이밍 **`use{FunctionName}`**. 사용 범위가 좁을수록 호출처 가까이 배치.

| 사용 범위                                 | 위치                                                        |
| ----------------------------------------- | ----------------------------------------------------------- |
| 완전 공용 (도메인 무관)                   | `libs/hooks/common/{hookName}/{hookName}.ts`                |
| 재사용 도메인 훅                          | `libs/hooks/{domain}/{hookName}/{hookName}.ts`              |
| 도메인 비즈니스 훅 (features 내부 재사용) | `libs/features/{domain}/hooks/{hookName}/`                  |
| Page/Container 내부 전용                  | `{Page\|Container}/hooks/{useXxx}/{useXxx}.ts` + `index.ts` |
| 단일 컴포넌트 전용                        | `{Component}/hooks/{useXxx}/{useXxx}.ts` + `index.ts`       |

모든 훅은 `{hookName}/` 폴더 구조를 따르고 `hooks/index.ts` (barrel) 도 함께 둔다.

한 hook 을 두 Page/Container 이상에서 공유하면 `libs/features/{domain}/hooks/` 로 승격.

**zustand store**: `use{X}Store` 도 훅과 같은 폴더 규칙을 따른다 — `libs/features/{domain}/store/{useXxxStore}/{useXxxStore}.ts` + `index.ts`. store 파일은 **default export 만** 둔다. 타입은 같은 폴더 `{useXxxStore}.types.ts`, named 상수는 `{useXxxStore}.constants.ts` 로 분리해 폴더 barrel 에서 노출한다. 세그먼트 `store/index.ts` 는 `export * from "./{useXxxStore}"` 형식.

```
store/
├── useToastStore/
│   ├── useToastStore.ts          # default export 만
│   ├── useToastStore.types.ts
│   └── index.ts                  # export { default as useToastStore } … + export * from "./useToastStore.types"
└── index.ts                      # export * from "./useToastStore"
```

---

## 스타일 작성 (Tailwind)

값(간격 · 둥글기 · 색 · 단위)의 기준은 `design-system.md` → Skill 이다. 이 절은 쓰는 형식만 정한다.
토큰은 `src/index.css` 의 `@theme` 한 곳에 있다. 클래스 숫자는 px 값이다 (`p-8` = 8px).

작성 규칙 (디자이너 O, 2026-11-19)

1. 토큰 클래스만 쓴다 — `gap-8` `p-12` `rounded-6` `text-sm` `bg-surface-hover`.
2. 토큰에 없는 너비 · 높이는 rem 대괄호 — `w-[36rem]`.
3. px 를 직접 쓰지 않는다. 화면 폭 조건(`max-[720px]:`)만 예외.
4. 색 값을 클래스에 직접 쓰지 않는다 — 토큰 이름으로.
5. 나란한 요소 사이 간격은 `gap`. 자식마다 `margin` 을 주지 않는다.
6. 버튼 · 입력 칸 둥글기는 6px (`rounded-6`).

쓰지 않는 클래스 — 테마로 막을 수 없어 빌드에는 생기지만 쓰지 않는다.

- px 로 나오는 것: `-px` 붙은 것(`p-px`) · 숫자 붙은 테두리(`border-2`) · `rounded-full`(알약은 `rounded-pill`) · `outline` · `ring` 계열 · `underline-offset-*` · `decoration-<숫자>` · `blur-*` · `drop-shadow-*` · `inset-shadow-*` · 대괄호 px
- `html` 62.5% 때문에 작아지는 이름 너비: `max-w-sm` · `w-sm` 등
- 토큰에 없는 글자 간격 · 줄 높이: `tracking-*` · `leading-*`

조건에 따라 클래스를 고를 때는 완성된 이름을 객체 · 삼항으로 고른다. 필요한 값이 토큰에 없으면 지어내지 말고 토큰을 더하자고 보고한다.

---

## 아이콘

상세는 **`.claude/rules/icon-guide.md`** 참조. 요지는:

- 외부 아이콘 패키지(`react-icons`, `lucide-react` 등) **사용 금지**. `views/components/icons/` 자체 구현만 사용
- `views/components/icons/{Name}Icon/{Name}Icon.tsx` + `index.ts`, props 는 `IconCommonProps` 하나
- `stroke="currentColor"` 고정 — 아이콘은 색을 갖지 않고 소비처가 결정

---

## Storybook

- 신규 컴포넌트는 `{Name}.stories.tsx` 를 같은 폴더에 동반한다 (Component·Container·Page·Layout 동일).
- `title` 은 폴더 경로를 미러링한다: **`{domain}/{layer}/[{subDomain}/]{Name}`** — layer 는 `components` | `containers` | `pages`.
  - 예: `document/components/{Name}`
  - `views/layouts/` 는 도메인이 없으므로 `layouts/{LayoutName}`, `views/components/icons/` 는 `icons/components/{Name}Icon`
  - `libs/storybook` 의 토큰 확인 스토리는 `storybook/{Name}`
  - 평탄 title(`{domain}/{Name}`)·layer 세그먼트 생략(`document/{subDomain}/{Name}`) 금지
  - **sub-component 는 부모 이름을 넣고 묶음 폴더 `components/` 는 뺀다**:
    `components/document/{subDomain}/{Parent}/components/{Sub}` → `document/components/{subDomain}/{Parent}/{Sub}`.
    부모를 빼면 어느 컴포넌트의 조각인지 트리에서 읽히지 않고, 안쪽 `components` 는 트리에 아무 정보도 주지 않는다

**예외** — 아래 두 경우는 스토리를 만들지 않는다.

- `@deprecated` 로 마킹돼 대체 컴포넌트로 마이그레이션 중인 것에는 스토리를 **새로 만들지 않는다**. 스토리는 대체 컴포넌트 쪽에 둔다(이미 있는 스토리는 그 컴포넌트를 지울 때 함께 지운다).
- props 없이 전역 훅으로만 트리거되는 싱글턴 래퍼 — 그 자체로는 보여줄 화면이 없고, 실제 UI 는 이미 스토리가 있는 다른 컴포넌트가 담당하는 경우 (예: 전역 확인 대화상자 래퍼와 그 안의 확인 모달).

---

## 테스트

- 도구는 Vitest. `npm test` 로 돈다.
- 계산 · 변환 로직(훅 · `utils/` · 스토어)은 같은 폴더에 `{name}.test.ts` 를 둔다. 화면 컴포넌트 테스트는 쓰지 않는다 — 화면은 Storybook 으로 본다.
- 로직 파일을 새로 만들거나 고치면 그 테스트도 같이 만든다 · 고친다.
- 테스트 파일은 barrel 에 넣지 않는다.

---

## 파일 네이밍 suffix (권장)

`*.types.ts` / `*.constants.ts` / `*.test.ts(x)` / `*.stories.tsx`. 단일 파일이면 suffix 없이 `types.ts`, `constants.ts` 도 허용.

---

## 선언 스타일

- **컴포넌트·훅은 arrow function 표현식으로 선언** — `const Button = (props: ButtonProps) => {...}; export default Button;`. `function Button(props) {}` 선언식 금지.
- 컴포넌트/훅 파일 안의 **보조 함수도 arrow function** 으로 통일 (`const resolveIcon = (...) => {...}`).
- `forwardRef` 래핑도 동일 — `const TextField = forwardRef<...>((props, ref) => {...}); export default TextField;`.
- 순수 유틸 모듈(`utils/`)의 함수도 arrow function 권장(named export 허용 영역이지만 스타일은 동일).

```tsx
// DO
const Button = (props: ButtonProps) => { ... };
export default Button;

// DON'T
function Button(props: ButtonProps) { ... }
export default Button;
```

---

## 익스포트 규칙

- 컴포넌트/훅 파일: **`export default`** 만 (named export 금지)
- **한 파일 한 hook**: 한 파일에 여러 named hook을 담지 않는다. 관련 hook이라도 각자 `{useXxx}/{useXxx}.ts` 폴더로 분리하고 default export. 묶음이 필요하면 같은 `hooks/` segment 안에 형제로 두고 `hooks/index.ts` 에서 `export *`
- 비컴포넌트 모듈(`*.types.ts`, `utils/`)은 named export 가 정상
- barrel `index.ts` 의 위치별 export 형식은 위 "barrel `index.ts` 의무 위치" 표 참조

---

## index.ts가 존재하는 경우 임포트 규칙

- **barrel(`index.ts`)을 통한 import 의무** — 컴포넌트/훅의 구현 파일을 직접 가리키지 않는다. 항상 폴더 barrel을 통한다 (`from "@views/components/common"`, `from "@libs/features/{domain}"`).
- **self-import 예외** — 같은 폴더(또는 같은 barrel이 묶는 영역) 내부에서는 상대 경로 / 직접 경로 허용. barrel 통한 self-import는 순환 위험으로 금지.
- **무거운 부품 예외** — `views/components/common` barrel 은 첫 화면부터 받는 청크라, 큰 라이브러리를 끌고 오는 부품(예: 마크다운 렌더 라이브러리를 쓰는 부품)은 barrel 에 넣지 않고 자기 폴더 barrel 로 직접 import 한다. 새 예외를 만들기 전에 번들 크기를 먼저 잰다.
- **병합** — 같은 파일에서 같은 barrel의 여러 심볼은 한 줄로 합친다. 값/타입은 별도 라인으로 분리.

```ts
// DO
import { Button, Skeleton, Table } from "@views/components/common";
import type { SelectOption } from "@views/components/common";

// DON'T
import Button from "@views/components/common/Button/Button";
import { Skeleton } from "@views/components/common/Skeleton";
import type { SelectOption } from "@views/components/common/Select/Select.types";
```

**alias** — `@` `@src` (→ `src/`), `@libs` (→ `src/libs/`), `@views` (→ `src/views/`). `vite.config.ts` 와 `tsconfig.app.json` 양쪽에 동일하게 선언돼 있어야 한다. TS import 에서 **`src/libs`·`src/views` 는 `@libs`·`@views` 로 적는다** — `@/libs/...`·`@/views/...` 는 ESLint 가 막는다(`agent_rules_fe` 「ESLint 사용자 규칙」).

---

## Prettier 포맷팅

- 모든 코드는 프로젝트 루트의 `.prettierrc` 설정을 따른다
- import 순서는 `importOrder` 가 자동 정렬하므로 수동으로 줄 순서를 바꾸지 않는다
- 순서: 스타일(`.css`) → `react` → `@libs` → `@views` → `@/` → 그 밖의 `@` 패키지 → 상대경로 → 서드파티
- Tailwind 클래스 순서는 `prettier-plugin-tailwindcss` 가 정렬 — 손으로 바꾸지 않는다

---

## 금지사항

| 금지                                                                                | 올바른 방법                                                                     |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `src/features/{domain}/...`                                                         | `src/libs/features/{domain}/...`                                                |
| `views/pages/{Domain}/...` (PascalCase 도메인)                                      | `views/pages/{domain}/...` (소문자)                                             |
| `views/components/common/DocumentList.tsx` (이름에 도메인 포함)                     | `views/components/{domain}/{Component}/...`                                     |
| `views/components/document/Button.tsx` (공통 용도)                                  | `views/components/common/Button/Button.tsx`                                     |
| subDomain 에 PascalCase / kebab-case (`RecentDocument`, `recent-document`)          | camelCase (`recentDocument/`)                                                   |
| 한 영역 내 단·복수 도메인 혼용 (`documents/` + `document/`)                         | 한쪽으로 통일                                                                   |
| Component 폴더 내 평탄 `.tsx` sub-component (`DocumentCard/DeleteButton.tsx`)       | `DocumentCard/components/DeleteButton/DeleteButton.tsx + index.ts`              |
| `parts/`, `sections/` 등 sub-component 그룹명                                       | `components/` 로 통일                                                           |
| `views/layouts/index.ts` 또는 각 `{Layout}/index.ts` 누락                           | barrel 의무                                                                     |
| 컴포넌트/타입을 직접 파일 경로로 import                                             | barrel에서 import _(`.types`·`.constants`·`X/X` 는 ESLint 강제)_                |
| `any` 타입                                                                          | 명시적 타입                                                                     |
| `function Button(props) {}` 선언식 컴포넌트/훅                                      | arrow function (`const Button = (props) => {}`) _(ESLint 강제)_                 |
| 외부 아이콘 패키지 import                                                           | `views/components/icons/` (`icon-guide.md`) _(ESLint 강제)_                     |
| prettier 포맷 미적용 / import 순서 수동 정렬                                        | `.prettierrc` 준수 (importOrder 자동 정렬)                                      |
| 컴포넌트 옆 `.css` 파일 · 인라인 `style` 로 꾸미기                                  | Tailwind 클래스 (「스타일 작성」)                                               |
| `bg-[#10b981]` · `p-[12px]` 처럼 값을 대괄호로 직접                                 | 토큰 클래스. 너비 · 높이만 `w-[36rem]` (rem)                                    |
| 클래스 이름을 문자열로 조립 (`` `bg-${color}` ``)                                   | 완성된 클래스 이름을 그대로 적는다 — 조립하면 빌드에 안 생긴다                  |
