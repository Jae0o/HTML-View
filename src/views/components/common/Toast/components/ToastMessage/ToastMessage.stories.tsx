import type { Meta, StoryObj } from "@storybook/react-vite";

import ToastMessage from "./ToastMessage";

const meta: Meta<typeof ToastMessage> = {
  title: "common/components/Toast/ToastMessage",
  component: ToastMessage,
  args: { children: "이 환경에서는 폴더 연결이 저장되지 않습니다." },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Short: Story = { args: { children: "폴더를 다시 연결하지 못했습니다." } };
