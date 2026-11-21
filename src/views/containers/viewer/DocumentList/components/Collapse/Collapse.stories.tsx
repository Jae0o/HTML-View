import type { Meta, StoryObj } from "@storybook/react-vite";

import Collapse from "./Collapse";

const meta: Meta<typeof Collapse> = {
  title: "viewer/containers/DocumentList/Collapse",
  component: Collapse,
  args: {
    open: true,
    children: (
      <div className="flex flex-col">
        {["구현 분석", "플랜", "결과 보고"].map(name => (
          <div
            key={name}
            className="flex min-h-[3.6rem] items-center pl-40 text-base text-text-primary"
          >
            {name}
          </div>
        ))}
      </div>
    ),
  },
  decorators: [
    Story => (
      <div className="w-[45.6rem] border-b border-border-default">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 펼친 상태 — 컨트롤에서 open 을 끄면 200ms 동안 접힌다 */
export const Open: Story = {};

/** 접힌 상태 — 안쪽은 지우지 않고 높이 0 으로 감춘다. 포커스도 가지 않는다 */
export const Closed: Story = { args: { open: false } };
