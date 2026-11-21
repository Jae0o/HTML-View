import type { Meta, StoryObj } from "@storybook/react-vite";

import Tag from "./Tag";

const meta: Meta<typeof Tag> = {
  title: "common/components/Tag",
  component: Tag,
  args: { children: "예시" },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Temporary: Story = { args: { children: "임시" } };
