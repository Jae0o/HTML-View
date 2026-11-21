import type { Meta, StoryObj } from "@storybook/react-vite";

import LogoMark from "./LogoMark";

const meta: Meta<typeof LogoMark> = {
  title: "common/components/LogoMark",
  component: LogoMark,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 빈 화면에 쓰는 크기 */
export const Large: Story = { args: { size: 48 } };

/** 문제 상황 — 흑백 · 투명도 40% 로 흐리게 */
export const Muted: Story = { args: { size: 48, className: "opacity-40 grayscale" } };
