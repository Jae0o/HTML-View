import type { RegisteredFolder } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import type { Meta, StoryObj } from "@storybook/react-vite";

import FolderRows from "./FolderRows";

const document = (name: string) => ({ name, fileName: `${name}.html`, handle: {} as FileSystemFileHandle });

// 스토리용 등록 폴더 — 폴더 연결(handle)은 화면에 쓰이지 않아 비워 둔다
const FOLDER = {
  id: "sample",
  name: "sample-project",
  status: "connected",
  htmlFolders: [
    { path: "", documents: [document("개요")] },
    { path: "001-create-side-menu", documents: [document("구현 분석"), document("플랜")] },
  ],
} as unknown as RegisteredFolder;

const meta: Meta<typeof FolderRows> = {
  title: "viewer/containers/DocumentList/FolderRows",
  component: FolderRows,
  args: { folder: FOLDER },
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

/** 줄에 마우스를 올리면 오른쪽에 등록 해제(✕) 버튼이 보인다. 누르면 확인 창이 뜬다 */
export const Connected: Story = {};

/** HTML 문서가 없는 등록 폴더 */
export const Empty: Story = { args: { folder: { ...FOLDER, htmlFolders: [] } } };

/** 연결이 끊긴 등록 폴더 — 「다시 연결」 과 등록 해제 버튼만 눌린다 */
export const Disconnected: Story = { args: { folder: { ...FOLDER, status: "disconnected", htmlFolders: [] } } };
