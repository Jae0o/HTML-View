import { type RegisteredFolder, filterFolders, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import type { Meta, StoryObj } from "@storybook/react-vite";

import SortableFolderRows from "./SortableFolderRows";

const document = (name: string) => ({ name, fileName: `${name}.html`, handle: {} as FileSystemFileHandle });

// 스토리용 등록 폴더 세 개 — 끌어 놓으면 스토어 순서가 바뀌어 다시 그려진다
const FOLDERS = [
  {
    id: "alpha",
    name: "alpha-project",
    handle: { name: "alpha-project" },
    status: "connected",
    htmlFolders: [{ path: "", documents: [document("개요")] }],
    hiddenPaths: [],
  },
  {
    id: "beta",
    name: "beta-project",
    handle: { name: "beta-project" },
    status: "connected",
    htmlFolders: [{ path: "001-create-side-menu", documents: [document("구현 분석"), document("플랜")] }],
    hiddenPaths: [],
  },
  {
    id: "gamma",
    name: "gamma-project",
    handle: { name: "gamma-project" },
    status: "disconnected",
    htmlFolders: [],
    hiddenPaths: [],
  },
] as unknown as RegisteredFolder[];

// 스토어의 등록 폴더를 그대로 넘긴다 — 순서를 바꾸면 스토어가 바뀌어 화면에 보인다
const StoreBoundRows = ({ query }: { query: string }) => {
  const folders = useFolderStore(state => state.folders);

  return (
    <SortableFolderRows
      matches={filterFolders(folders, query)}
      isSearching={query.trim() !== ""}
    />
  );
};

const meta: Meta<typeof StoreBoundRows> = {
  title: "viewer/containers/DocumentList/SortableFolderRows",
  component: StoreBoundRows,
  args: { query: "" },
  decorators: [
    Story => (
      <div className="w-[45.6rem]">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    useFolderStore.setState({ folders: FOLDERS });
    useViewerStore.setState({ selectedDocument: null, favorites: [], visibleFormats: ["html", "md"] });
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 등록 폴더 줄을 끌어 다른 등록 폴더의 위 · 아래에 놓으면 순서가 바뀐다. 놓을 자리에 초록 가로줄이 보인다 */
export const Default: Story = {};

/** 검색 중 — 일부만 보여 끌지 못한다 */
export const Searching: Story = { args: { query: "beta" } };
