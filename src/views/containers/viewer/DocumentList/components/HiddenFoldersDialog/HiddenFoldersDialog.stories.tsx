import type { Meta, StoryObj } from "@storybook/react-vite";

import HiddenFoldersDialog from "./HiddenFoldersDialog";

const meta: Meta<typeof HiddenFoldersDialog> = {
  title: "viewer/containers/DocumentList/HiddenFoldersDialog",
  component: HiddenFoldersDialog,
  args: {
    open: true,
    folderName: "sample-project",
    hiddenPaths: [".storybook", "done"],
    onShow: () => {},
    onClose: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 줄마다 「다시 보이기」 가 있다 */
export const Default: Story = {};

/** 하나만 숨겼을 때 */
export const One: Story = { args: { hiddenPaths: ["done"] } };

/** 최상위 줄과 긴 경로 — 최상위는 「최상위」 로 보이고, 긴 경로는 줄을 바꾼다 */
export const RootAndLongPath: Story = {
  args: {
    hiddenPaths: ["", ".claude / docs / done / folder-rename-file-actions / completed-docs / reference / designer"],
  },
};

/** 숨긴 폴더가 많을 때 — 목록만 스크롤된다 */
export const Many: Story = {
  args: { hiddenPaths: Array.from({ length: 30 }, (_, index) => `plan-${index + 1} / completed-docs`) },
};
