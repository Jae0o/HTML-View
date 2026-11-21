import { useViewerStore } from "@libs/features/viewer";

import type { Meta, StoryObj } from "@storybook/react-vite";

import DocumentRow from "./DocumentRow";

const meta: Meta<typeof DocumentRow> = {
  title: "viewer/containers/DocumentList/DocumentRow",
  component: DocumentRow,
  args: {
    folderId: "sample",
    path: "plan-a",
    depth: 2,
    document: { name: "구현 분석", fileName: "구현 분석.html", handle: {} as FileSystemFileHandle },
  },
  decorators: [
    Story => (
      <div className="w-[33.6rem]">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    useViewerStore.setState({ selectedDocument: null });
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 누르면 그 문서를 고른다 */
export const Default: Story = {};

/** 지금 보고 있는 문서 */
export const Selected: Story = {
  beforeEach: () => {
    useViewerStore.setState({ selectedDocument: { folderId: "sample", path: "plan-a", fileName: "구현 분석.html" } });
  },
};
