---
paths:
  - src/**/*.ts
  - src/**/*.tsx
---

# 에이전트 작업 규칙 — FE (React/Vite)

프론트엔드 전용 작업 규칙. 공통 규칙은 `agent_rules_common.md` 참조.
컴포넌트·스타일 작성 형식·아이콘 컨벤션 상세는 `react-conventions.md` / `icon-guide.md` 참조.

화면에 보이는 값(색·글자·간격·둥글기)은 `design-system.md` → `design-system` Skill 이 기준이다.
우선순위는 `agent_rules_common.md` 「디자인 기준 · 우선순위」.

## Custom Hook 분리 기준

부수효과를 동반하거나 재사용되는 로직만 custom hook 으로 분리한다. zustand store 접근은
컴포넌트에서 selector(`useXxxStore(state => state.y)`)를 직접 호출하는 것이 기본이며, 이를 다시
훅으로 감싸지 않는다.

**훅으로 분리한다**:

- `useEffect`·observer·이벤트 리스너 등 **부수효과**를 동반하는 로직 (예: 라우트 변경 시 드로어 닫힘, IntersectionObserver 스크롤 스파이).
- 여러 컴포넌트에서 재사용하거나, store 인터페이스를 단순화하는 공용 진입점(public API).

**훅으로 감싸지 않는다(오버엔지니어링)**:

- selector 한두 줄 단순 읽기 — 컴포넌트에서 직접 호출한다.
- 현재 소비하지 않는 액션까지 노출하는 래퍼 — 반환값은 실제 쓰는 값만 둔다.

배치·네이밍은 일반 원칙을 따른다: 동작 기준으로 `use{Behavior}` 로 명명하고, 사용 범위가 좁을수록
호출처 가까이 두며, 두 곳 이상에서 공유하면 공용 훅 디렉터리로 승격한다. 반환값은 실제 소비하는
값만 노출한다. 상세 배치표는 `react-conventions.md` "커스텀 훅" 참조.

## 상태 경계

같은 데이터를 두 곳에 두지 않는다. 0Docs 는 서버가 없다.

| 소유자 | 대상 (예) |
| --- | --- |
| **zustand** (`libs/features/{domain}/store`) | 연 폴더 목록 · 문서 목록 · 고른 문서 · 화면 상태 |
| **브라우저 저장소** | 다음 방문에도 남길 것 — 폴더 핸들 · 즐겨찾기 · 최근 본 문서 |
| **컴포넌트 `useState`** | 그 컴포넌트만 쓰는 열림 · 입력 값 |

폴더에서 읽어 온 값을 화면마다 따로 복사해 들고 있지 않는다. 계산으로 나오는 값(정렬 · 거르기 결과)은 저장하지 않고 그릴 때 계산한다.

## ESLint 사용자 규칙

아래 4가지는 ESLint 사용자 규칙으로 막는다. lint 를 끄는 주석(`eslint-disable`)으로 우회하지 않는다.

| 규칙 | 왜 막는가 |
| --- | --- |
| ① 컴포넌트·훅·보조 함수·`forwardRef` 래핑은 화살표 함수 표현식 | 선언 형태를 하나로 맞춰 hoisting 에 기대는 코드와 리뷰 때 형태 논쟁을 없앤다 (`react-conventions.md` 「선언 스타일」) |
| ② `@/libs` · `@/views` 대신 `@libs` · `@views` | 같은 파일을 두 별칭으로 부르면 import 정렬 · 검색 · 중복 병합이 갈린다 |
| ② `.types` · `.constants` 직접 import, 구현 파일 직접 import(`.../X/X`) 금지 — 폴더 barrel 까지만 | barrel 이 공개 API 경계다. 우회하면 폴더 안 파일을 옮기거나 나눌 때 바깥이 깨진다 |
| ③ barrel 의 무명 default 재노출(`export { default } from "./X"`) 금지 | named 한 줄과 중복 export 가 되고 import 이름이 소비처마다 달라진다 (`agent_rules_common.md` 「Barrel」) |
| ④ 외부 아이콘 패키지(`react-icons` 등) import 금지 | 획 · 크기 규칙이 다른 아이콘이 섞이고 번들이 커진다. 자체 아이콘만 쓴다 (`icon-guide.md`) |

## 금지사항

| 금지 | 올바른 방법 |
| --- | --- |
| `react-icons` 등 외부 아이콘 패키지 | `views/components/icons/` 자체 아이콘 (`icon-guide.md`) _(ESLint 강제)_ |
| 같은 데이터를 스토어와 `useState` 에 동시에 보관 | 한 소유자만 둔다 (상태 경계 절) |
