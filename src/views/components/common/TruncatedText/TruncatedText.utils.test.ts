import { calcPopBox, calcPopTop } from "./TruncatedText.utils";

import { describe, expect, it } from "vitest";

describe("calcPopBox", () => {
  it("글자보다 위로 2px · 왼쪽으로 7px 나가고, 좁은 칸은 최소 320px 로 넓힌다", () => {
    expect(calcPopBox({ top: 100, left: 50, width: 200, bottom: 120 }, 1200)).toEqual({
      top: 98,
      left: 43,
      width: 320,
    });
  });

  it("칸이 넓으면 칸 폭 + 좌우 7px 이다", () => {
    expect(calcPopBox({ top: 100, left: 50, width: 400, bottom: 120 }, 1200).width).toBe(414);
  });

  it("화면 오른쪽 끝에서는 화면 끝 8px 안쪽까지만 넓힌다", () => {
    // 왼쪽 943 에서 시작 → 화면 끝까지 남은 폭 1200 - 8 - 943 = 249
    expect(calcPopBox({ top: 100, left: 950, width: 200, bottom: 120 }, 1200).width).toBe(249);
  });

  it("남은 폭이 칸 폭 + 14px 보다 좁아도 그 아래로는 줄이지 않는다", () => {
    expect(calcPopBox({ top: 100, left: 1050, width: 200, bottom: 120 }, 1200).width).toBe(214);
  });

  it("최소 폭을 0 으로 넘기면(목록 줄) 좁은 칸도 칸 폭 + 좌우 7px 이다", () => {
    expect(calcPopBox({ top: 100, left: 50, width: 200, bottom: 120 }, 1200, 0).width).toBe(214);
  });
});

describe("calcPopTop", () => {
  it("아래로 펼칠 수 있으면 그대로 둔다", () => {
    expect(calcPopTop(98, 120, 60, 800)).toBe(98);
  });

  it("화면 아래 8px 안에 못 들어오면 상자 아래 끝을 글자 아래 2px 에 맞춘다", () => {
    expect(calcPopTop(758, 780, 60, 800)).toBe(722);
  });
});
