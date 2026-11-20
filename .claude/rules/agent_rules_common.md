# 에이전트 작업 규칙 — 공통

이 프로젝트 전반에 적용되는 작업 규칙. 스택 종속 규칙은 `agent_rules_fe.md` 참조.

주제별 상세 규칙:

- 디자인 시스템 — `design-system.md` (`design-system` Skill 사용 지시문. 디자인 값 · 값 규칙은 Skill 이 가진다)
- 상태 경계 · 훅 분리 · ESLint 사용자 규칙 — `agent_rules_fe.md`
- 컴포넌트 · 스타일 작성 형식(Tailwind) · Storybook · 테스트 · 아이콘 — `react-conventions.md` / `icon-guide.md`(픽셀 격자 포함)
- 화면 문구 — `ui-copy.md`

## 디자인 기준 · 우선순위

값이 서로 다르면 위에서부터 처음 맞는 것을 따른다.

1. 공용 디자인 시스템 판정 — `design-system` Skill (jae0-fe 플러그인, `design-system.md` 지시문)
2. 0Docs 디자인 값 — `src/index.css` 의 `@theme` 토큰 (글자 · 색 · 그림자는 프로토타입 확정 값, 디자이너 O)
3. 프로토타입 화면
4. 지금 코드

프로토타입과 코드가 다르면 고치기 전에 묻는다. 디자인 수정은 디자이너에게 요청한다.

### 0Docs 글자 크기

| 클래스 | 크기 | 줄 높이 | 쓰임 |
| --- | --- | --- | --- |
| `text-base` | 13 | 20 | 본문 · 버튼 · 입력 |
| `text-sm` | 12 | 18 | 보조 · 메타 |
| `text-logo` | 16 | 20 | 로고 글자만 (예외) |

글자 크기를 새로 더하지 않는다. 필요하면 토큰을 먼저 더하자고 보고한다.

## 디버깅 중 시도한 수정 정리

문제의 원인을 분석·탐색하는 과정에서 추정으로 넣은 수정이 실제 원인과 무관함(동작에 영향 없음)이
확인되면 반드시 롤백한다. 최종 변경에는 진짜 원인을 고친 코드만 남긴다.

## 오버엔지니어링 금지

요청한 것만 구현한다. 미사용 props·추상화·speculative 한 유연성을 추가하지 않는다. 더 단순한 방법이 있으면 그쪽을 택한다.

## 신규 생성 전 기존 검색

컴포넌트·훅·유틸을 새로 만들기 전에 같은 역할이 이미 있는지 **역할 키워드로 grep** 한다.
검색 범위는 공용(`common/`, `libs/hooks/common`, `libs/features/*/utils`)과 인접 도메인,
Container 의 sub-component 까지. 이미 있으면 재사용이 기본이고, 그래도 새로 만들 때는
작업 보고에 검색 결과를 한 줄 남긴다("기존 후보 N건, 재사용 불가 사유: …").

## Barrel(index.ts) export 형식

구현 파일이 `export default` 만 가질 때, barrel 은 **named 재노출 한 줄만** 선언한다.

```ts
// DO — useApplyTheme/index.ts
export { default as useApplyTheme } from "./useApplyTheme";
```

- 무명 default 재노출(`export { default } from "./X"`)은 ESLint(`no-restricted-syntax`)가 차단한다.
- 구현 파일 대상 `export *` 는 no-op 이라 금지(default 는 `*` 에 미포함). `export *` 는 `.types.ts` 처럼 named export 만 있는 파일에만 쓴다.
