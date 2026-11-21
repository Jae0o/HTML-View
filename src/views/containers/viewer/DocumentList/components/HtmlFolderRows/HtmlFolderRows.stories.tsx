import type { HtmlFolder } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import type { Meta, StoryObj } from "@storybook/react-vite";

import HtmlFolderRows from "./HtmlFolderRows";

const document = (name: string) => ({ name, fileName: `${name}.html`, handle: {} as FileSystemFileHandle });

const HTML_FOLDER: HtmlFolder = { path: "001-create-side-menu", documents: [document("구현 분석"), document("플랜")] };

const meta: Meta<typeof HtmlFolderRows> = {
  title: "viewer/containers/DocumentList/HtmlFolderRows",
  component: HtmlFolderRows,
  args: { folderId: "sample", htmlFolder: HTML_FOLDER, label: HTML_FOLDER.path },
  decorators: [
    Story => (
      <div className="w-[45.6rem]">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    useViewerStore.setState({ selectedDocument: null, favorites: [] });
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 처음에는 접혀 있다 — 누르면 문서 줄이 펼쳐진다 */
export const Collapsed: Story = {};

/** 보던 문서가 든 폴더는 펼친 채로 시작한다 */
export const WithSelectedDocument: Story = {
  beforeEach: () => {
    useViewerStore.setState({
      selectedDocument: { folderId: "sample", path: "001-create-side-menu", fileName: "플랜.html" },
    });
  },
};
