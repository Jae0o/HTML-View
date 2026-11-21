import { FolderPlusIcon } from "@views/components/icons";

import type { Meta, StoryObj } from "@storybook/react-vite";

import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "common/components/Button",
  component: Button,
  args: { children: "취소" },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = { args: { variant: "primary", children: "폴더 추가" } };

export const Danger: Story = { args: { variant: "danger", children: "해제" } };

export const Text: Story = { args: { variant: "text", children: "예시 폴더 넣기" } };

export const WithIcon: Story = { args: { icon: <FolderPlusIcon />, children: "폴더 추가" } };

/** 네 종류를 한 줄에서 비교한다 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Button>취소</Button>
      <Button variant="primary">폴더 추가</Button>
      <Button variant="danger">해제</Button>
      <Button variant="text">예시 폴더 넣기</Button>
    </div>
  ),
};
