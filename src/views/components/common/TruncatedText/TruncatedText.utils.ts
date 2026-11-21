/** 펼친 상자가 화면 끝에서 남길 여백(px) */
const EDGE_MARGIN = 8;

/** 상자 테두리 1 + 안쪽 여백 6 — 이만큼 왼쪽에서 시작해야 첫 글자가 보이던 자리에 온다(px) */
const INSET_X = 7;

/** 상자 테두리 1 + 위 여백 1 (px) */
const INSET_Y = 2;

/** 펼친 상자 최소 폭(px) */
const MIN_WIDTH = 320;

export interface TextRect {
  top: number;
  left: number;
  width: number;
  bottom: number;
}

export interface PopBox {
  top: number;
  left: number;
  width: number;
}

/**
 * 펼친 상자의 자리 · 폭(px). 첫 줄이 보이던 글자와 같은 자리에 오게 한다.
 * 가로로 옮기지 않는다 — 화면 오른쪽 끝에서는 폭만 줄여 그 안에서 줄바꿈한다(칸 폭 아래로는 안 줄임).
 */
export const calcPopBox = (rect: TextRect, viewportWidth: number): PopBox => {
  const left = rect.left - INSET_X;
  const cellWidth = rect.width + INSET_X * 2;
  const roomToEdge = viewportWidth - EDGE_MARGIN - left;

  return {
    top: rect.top - INSET_Y,
    left,
    width: Math.min(Math.max(cellWidth, MIN_WIDTH), Math.max(cellWidth, roomToEdge)),
  };
};

/**
 * 화면 아래가 상자를 못 받을 때만 위로 펼친다 — 상자 아래 끝을 글자 줄 아래 2px 에 맞춘 top(px).
 * 아래로 펼칠 수 있으면 받은 top 그대로다.
 */
export const calcPopTop = (top: number, textBottom: number, popHeight: number, viewportHeight: number): number => {
  if (top + popHeight <= viewportHeight - EDGE_MARGIN) return top;

  return textBottom + INSET_Y - popHeight;
};
