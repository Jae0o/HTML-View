import { MenuIcon } from "@views/components/icons";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconButton } from "../IconButton";
import Tooltip from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "common/components/Tooltip",
  component: Tooltip,
  args: {
    label: "목록 접기",
    children: (
      <IconButton
        variant="ghost"
        aria-label="목록 접기"
        icon={<MenuIcon />}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        component: "대상에 마우스를 올리거나 Tab 으로 포커스하면 보인다. 마우스로 누른 뒤에는 남지 않는다.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Bottom: Story = {};

export const Top: Story = { args: { placement: "top" } };

/** 스크롤되는 좁은 상자 안 — 풍선이 상자에 잘리지 않는다 */
export const InScrollBox: Story = {
  render: args => (
    <div className="flex h-40 w-[20rem] justify-end overflow-auto rounded-6 border border-border-default p-4">
      <Tooltip {...args} />
    </div>
  ),
};
