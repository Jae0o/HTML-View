import { calcTooltipPosition } from "./Tooltip.utils";

import { describe, expect, it } from "vitest";

describe("calcTooltipPosition", () => {
  const rect = { top: 100, bottom: 132, left: 40, width: 32 };

  it("bottom 은 대상 아래 6px, 대상의 가로 가운데다", () => {
    expect(calcTooltipPosition(rect, "bottom")).toEqual({ top: 138, left: 56 });
  });

  it("top 은 대상 위 6px 을 풍선 아래 끝 자리로 준다", () => {
    expect(calcTooltipPosition(rect, "top")).toEqual({ top: 94, left: 56 });
  });
});
