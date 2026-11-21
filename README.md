# 0Docs

내 컴퓨터의 폴더에 쌓인 HTML 문서를 한곳에서 골라 보는 뷰어. 서버 없이 브라우저만으로 동작한다.

- 폴더를 등록하면 그 안에서 HTML 문서가 든 폴더만 추려 목록으로 보여 준다.
- 등록한 폴더와 보던 문서, 즐겨찾기는 이 브라우저에 기억한다. 파일을 올리거나 다른 곳으로 보내지 않는다.
- 폴더 선택 기능이 있는 브라우저에서만 쓸 수 있다.

## 실행

Node 22 가 필요하다 (`.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5177
```

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입 검사 뒤 `dist/` 에 빌드 |
| `npm run preview` | 빌드 결과 미리 보기 |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (`src`) |
| `npm test` | Vitest |
| `npm run storybook` | Storybook (`http://localhost:6006`) |

## 배포

정적 파일만 올리면 된다. 서버 · 환경 변수 · 주소 다시 쓰기 설정이 없다.

| 항목 | 값 |
| --- | --- |
| 빌드 명령 | `npm run build` |
| 결과 폴더 | `dist` |
| Node | 22 |

폴더 선택 기능은 보안 연결(https)이나 `localhost` 에서만 동작한다.

## 구조

```
src/
  libs/features/folder   등록 폴더 — 훑기 · 기기 저장 · 스토어
  libs/features/viewer   화면 설정 — 목록 열림 · 고른 문서 · 즐겨찾기
  libs/features/toast    알림
  views/layouts          화면 틀
  views/pages            화면
  views/containers       본문 · 문서 목록
  views/components       공통 컴포넌트 · 아이콘 · 목록 줄
```

작업 규칙은 `.claude/rules/` 에 있다.
