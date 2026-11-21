import type { Meta, StoryObj } from "@storybook/react-vite";

import ErrorFallback from "./ErrorFallback";

const meta: Meta<typeof ErrorFallback> = {
  title: "common/components/ErrorFallback",
  component: ErrorFallback,
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
