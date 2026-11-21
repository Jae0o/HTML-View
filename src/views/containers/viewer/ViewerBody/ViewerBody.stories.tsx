import { type RegisteredFolder, useFolderStore } from "@libs/features/folder";

import type { Meta, StoryObj } from "@storybook/react-vite";

import ViewerBody from "./ViewerBody";

// 스토리용 등록 폴더 — 화면은 폴더가 있는지만 본다
const SAMPLE_FOLDER = {
  id: "sample",
  name: "sample-project",
  status: "connected",
  htmlFolders: [],
} as unknown as RegisteredFolder;

const meta: Meta<typeof ViewerBody> = {
  title: "viewer/containers/ViewerBody",
  component: ViewerBody,
  parameters: { layout: "fullscreen" },
  decorators: [
    Story => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 등록된 폴더가 없다 — 「폴더 추가」 를 누르면 폴더 선택 창이 뜬다 */
export const NoFolder: Story = {
  beforeEach: () => {
    useFolderStore.setState({ isRestored: true, folders: [] });
  },
};

/** 폴더는 있고 문서를 고르지 않았다 */
export const NoDocument: Story = {
  beforeEach: () => {
    useFolderStore.setState({ isRestored: true, folders: [SAMPLE_FOLDER] });
  },
};
