import { withLinkGuard } from "./ViewerBody.utils";

import { describe, expect, it } from "vitest";

describe("withLinkGuard", () => {
  it("문서 내용은 그대로 두고 맨 뒤에 스크립트 하나를 붙인다", () => {
    const html = "<h1>문서</h1>";
    const guarded = withLinkGuard(html);

    expect(guarded.startsWith(html)).toBe(true);
    expect(guarded.slice(html.length)).toMatch(/^<script>.*<\/script>$/);
  });
});
