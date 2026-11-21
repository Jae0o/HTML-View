import useToastStore from "./useToastStore";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useToastStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    useToastStore.getState().hide();
    vi.useRealTimers();
  });

  it("show 하면 글자가 보이고 4초 뒤 사라진다", () => {
    useToastStore.getState().show("폴더를 다시 연결하지 못했습니다.");
    expect(useToastStore.getState().message).toBe("폴더를 다시 연결하지 못했습니다.");

    vi.advanceTimersByTime(3999);
    expect(useToastStore.getState().message).toBe("폴더를 다시 연결하지 못했습니다.");

    vi.advanceTimersByTime(1);
    expect(useToastStore.getState().message).toBeNull();
  });

  it("떠 있는 동안 다시 show 하면 글자를 바꾸고 시간을 다시 센다", () => {
    useToastStore.getState().show("첫 알림");
    vi.advanceTimersByTime(3000);

    useToastStore.getState().show("둘째 알림");
    vi.advanceTimersByTime(3000);
    expect(useToastStore.getState().message).toBe("둘째 알림");

    vi.advanceTimersByTime(1000);
    expect(useToastStore.getState().message).toBeNull();
  });

  it("hide 하면 바로 사라지고 남은 시간이 뒤 알림을 지우지 않는다", () => {
    useToastStore.getState().show("첫 알림");
    useToastStore.getState().hide();
    expect(useToastStore.getState().message).toBeNull();

    useToastStore.getState().show("둘째 알림");
    vi.advanceTimersByTime(3999);
    expect(useToastStore.getState().message).toBe("둘째 알림");
  });
});
