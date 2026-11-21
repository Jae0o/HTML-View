import type { Meta, StoryObj } from "@storybook/react-vite";

import BrandLogo from "./BrandLogo";

const meta: Meta<typeof BrandLogo> = {
  title: "common/components/BrandLogo",
  component: BrandLogo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
