import type { Meta, StoryObj } from "@storybook/react-vite";

import FloatingSurface from "./FloatingSurface";

const meta: Meta<typeof FloatingSurface> = {
  title: "common/components/FloatingSurface",
  component: FloatingSurface,
  args: { className: "w-[36rem] p-12", children: "떠 있는 상자 안 내용" },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
