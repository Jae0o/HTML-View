import type { Meta, StoryObj } from "@storybook/react-vite";

import HidePathDialog from "./HidePathDialog";

const meta: Meta<typeof HidePathDialog> = {
  title: "viewer/containers/DocumentList/HidePathDialog",
  component: HidePathDialog,
  args: { path: "done / features-1 / completed-docs", onHide: () => {}, onCancel: () => {} },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 처음에는 맨 끝(completed-docs)이 골라져 있다. done 을 누르면 done 아래가 모두 숨겨진다 */
export const Default: Story = {};

/** 폴더가 둘뿐인 경로 */
export const TwoFolders: Story = { args: { path: "help-modal / completed-docs" } };

/** 긴 경로 — 버튼이 줄을 바꿔 이어진다 */
export const LongPath: Story = {
  args: { path: ".claude / docs / done / folder-rename-file-actions / completed-docs / reference / designer" },
};

/** 아주 긴 폴더 이름 — 창 폭에서 말줄임하고, 마우스를 올리면 전체 이름이 보인다 */
export const LongName: Story = {
  args: { path: "done / 2026-11-22-folder-hide-with-a-very-long-plan-name-for-truncation / completed-docs" },
};
