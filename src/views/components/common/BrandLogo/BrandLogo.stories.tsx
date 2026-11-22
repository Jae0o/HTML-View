import type { Meta, StoryObj } from "@storybook/react-vite";

import BrandLogo from "./BrandLogo";

const meta: Meta<typeof BrandLogo> = {
  title: "common/components/BrandLogo",
  component: BrandLogo,
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 로고 줄 크기 */
export const Default: Story = {};

/** 글 사이에 넣는 작은 크기 — 도움말 창 · 이름 변경 창 설명 */
export const Small: Story = { args: { size: "s" } };
