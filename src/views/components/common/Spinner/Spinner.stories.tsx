import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import Spinner from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "common/components/Spinner",
  component: Spinner,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Brand: Story = {};

export const Neutral: Story = { args: { tone: "neutral" } };

/** 목록 줄 안 — 폴더를 읽는 동안 */
export const InRow: Story = {
  render: () => (
    <div className="flex items-center gap-8 text-text-tertiary">
      <Spinner />
      폴더를 읽는 중
    </div>
  ),
};

/** 버튼 안 — 글자 앞 아이콘 자리에 넣는다 */
export const InButton: Story = {
  render: () => <Button icon={<Spinner tone="neutral" />}>다시 연결</Button>,
};
