import { useViewerStore } from "@libs/features/viewer";

import { Button } from "@views/components/common";

import type { Meta, StoryObj } from "@storybook/react-vite";

import HelpDialog from "./HelpDialog";

const meta: Meta<typeof HelpDialog> = {
  title: "viewer/containers/HelpDialog",
  component: HelpDialog,
  parameters: { docs: { disable: true } },
  decorators: [
    Story => (
      <>
        <Button onClick={() => useViewerStore.getState().openHelp()}>도움말 열기</Button>
        <Story />
      </>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 열린 도움말 창 — 닫기 버튼 · Esc 로 닫고, 「도움말 열기」 로 다시 연다 */
export const Open: Story = {
  beforeEach: () => {
    useViewerStore.setState({ isHelpOpen: true });

    // 스토어는 스토리끼리 이어진다 — 다른 스토리로 넘어가면 닫아 둔다
    return () => useViewerStore.setState({ isHelpOpen: false });
  },
};
