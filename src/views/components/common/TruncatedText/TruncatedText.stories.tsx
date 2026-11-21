import type { Meta, StoryObj } from "@storybook/react-vite";

import TruncatedText from "./TruncatedText";

const LONG = "003-refactor-side-menu-with-a-very-long-folder-name-for-truncation";

const meta: Meta<typeof TruncatedText> = {
  title: "common/components/TruncatedText",
  component: TruncatedText,
  args: { text: LONG },
  parameters: { docs: { description: { component: "잘렸을 때만 마우스 올림 · Tab 포커스로 그 자리에서 펼친다." } } },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 칸이 좁아 잘린다 — 마우스를 올리면 펼쳐진다 */
export const Truncated: Story = {
  render: args => (
    <div className="w-[22rem]">
      <TruncatedText {...args} />
    </div>
  ),
};

/** 칸이 넓어 잘리지 않는다 — 펼침도 포커스도 없다 */
export const NotTruncated: Story = {
  render: args => (
    <div className="w-[60rem]">
      <TruncatedText {...args} />
    </div>
  ),
};

/** 쓰는 자리의 글자 · 색 · 배경을 따른다 — 선택된 목록 줄 모양 */
export const FollowsPlace: Story = {
  render: args => (
    <div className="flex h-32 w-[22rem] items-center rounded-6 bg-brand-bg-muted px-6 font-semibold text-text-brand">
      <TruncatedText
        {...args}
        className="flex-1"
      />
    </div>
  ),
};
