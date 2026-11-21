import type { Meta, StoryObj } from "@storybook/react-vite";

import MoreMenu from "./MoreMenu";

const meta: Meta<typeof MoreMenu> = {
  title: "viewer/containers/DocumentList/MoreMenu",
  component: MoreMenu,
  args: { items: [{ label: "등록 해제", onSelect: () => {} }] },
  decorators: [
    Story => (
      // 줄에 마우스를 올렸을 때만 ⋯ 가 보인다 — 줄과 같은 group 을 둔다
      <div className="group flex w-[45.6rem] justify-end rounded-6 py-8 pr-8 hover:bg-brand-bg-subtle">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 마우스를 올리면 ⋯ 가 보이고, 누르면 버튼 아래 오른쪽 맞춤으로 메뉴가 열린다 */
export const Default: Story = {};

/** 화면 아래 끝에 있을 때 — 아래가 모자라 메뉴가 위로 열린다 */
export const AtBottom: Story = {
  parameters: { layout: "fullscreen" },
  decorators: [
    Story => (
      <div className="flex h-screen items-end p-16">
        <Story />
      </div>
    ),
  ],
};
