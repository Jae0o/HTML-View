import type { Meta, StoryObj } from "@storybook/react-vite";

import ErrorBoundary from "./ErrorBoundary";

// 그리다가 오류를 내는 화면 — 오류 경계가 오류 화면으로 바꾸는지 본다
const Broken = (): never => {
  throw new Error("스토리용 오류");
};

const meta: Meta<typeof ErrorBoundary> = {
  title: "common/components/ErrorBoundary",
  component: ErrorBoundary,
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Caught: Story = { args: { children: <Broken /> } };

export const NoError: Story = {
  args: { children: <p className="m-0 p-24">오류가 없으면 안쪽 화면을 그대로 보여 준다</p> },
};
