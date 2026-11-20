import js from "@eslint/js";

import prettierConfig from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // .claude/worktrees 는 에이전트가 저장소 안에 만드는 워크트리라, 빼지 않으면
  // 로컬 `eslint .` 가 다른 브랜치 사본까지 통째로 검사한다.
  globalIgnores(["dist", "storybook-static", ".claude/worktrees"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    languageOptions: { globals: globals.browser },
    rules: {
      // `_` prefix 는 의도적 미사용 표시.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],

      // [icon-guide] 외부 아이콘 패키지 금지 / [react-conventions] barrel 경유 import
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react-icons", "react-icons/*", "lucide-react", "lucide-react/*", "@heroicons/*"],
              message: "외부 아이콘 패키지 금지 — views/components/icons 자체 아이콘 사용 (icon-guide.md)",
            },
            // 깊이로는 막지 않는다 — 폴더 barrel 과 평탄 구현 파일이 같은 깊이에 섞여 있어 경로만으로
            // 가를 수 없다. 모양으로 구별되는 두 가지만 막는다.
            {
              regex: "^@/?(?:views/(?:components|containers)|libs/features)/.+\\.(?:types|constants)$",
              message:
                ".types/.constants 파일 직접 import 금지 — barrel(index.ts) 을 통해 import (react-conventions.md)",
            },
            {
              regex: "^@/?(?:views/(?:components|containers)|libs/features)/(?:.+/)?([^/]+)/\\1$",
              message:
                "구현 파일 직접 import 금지 — 폴더(barrel) 까지만 적는다: .../X/X → .../X (react-conventions.md)",
            },
            {
              // alias 표준 — src/libs·src/views 는 @libs·@views 로 적는다 (react-conventions.md)
              group: ["@/libs", "@/libs/*", "@/views", "@/views/*"],
              message: "alias 는 @libs·@views 를 쓴다. @/ 는 그 밖의 src 경로(@/assets 등)에만.",
            },
          ],
        },
      ],

      // [react-conventions 선언 스타일] arrow function 강제.
      // eslint-plugin-react(function-component-definition)는 ESLint 10 을 지원하지 않아 넣지 않는다 —
      // 함수 선언식 컴포넌트도 func-style 이 막는다.
      "func-style": ["error", "expression"],

      // [agent_rules_common] barrel 무명 default 재노출 금지
      "no-restricted-syntax": [
        "error",
        {
          selector: 'ExportNamedDeclaration[source] ExportSpecifier[local.name="default"][exported.name="default"]',
          message: 'barrel 은 named 한 줄만 — export { default as X } from "./X" (agent_rules_common.md)',
        },
      ],
    },
  },
  {
    // .constants.tsx 는 JSX 를 담은 상수 파일이지 컴포넌트 파일이 아니다 — Fast Refresh 경계 규칙의 대상이 아니다
    files: ["**/*.constants.tsx"],
    rules: { "react-refresh/only-export-components": "off" },
  },
]);
