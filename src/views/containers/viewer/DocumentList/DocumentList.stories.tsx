import { type RegisteredFolder, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import type { Meta, StoryObj } from "@storybook/react-vite";

import DocumentList from "./DocumentList";

// 스토리용 등록 폴더 — 폴더 연결(handle)은 실제 폴더 이름만 쓴다(이름 변경 입력 칸을 비우면 보이는 글자)
const document = (name: string) => ({ name, fileName: `${name}.html`, handle: {} as FileSystemFileHandle });

const FOLDERS = [
  {
    id: "sample",
    name: "sample-project",
    handle: { name: "sample-project" },
    status: "connected",
    htmlFolders: [
      { path: "", documents: [document("개요")] },
      { path: "001-create-side-menu", documents: [document("구현 분석"), document("플랜")] },
      {
        path: "003-refactor-side-menu-with-a-very-long-folder-name-for-truncation / completed",
        documents: [document("결과 보고")],
      },
    ],
  },
  { id: "empty", name: "empty-project", handle: { name: "empty-project" }, status: "connected", htmlFolders: [] },
  { id: "lost", name: "moved-project", handle: { name: "moved-project" }, status: "disconnected", htmlFolders: [] },
] as unknown as RegisteredFolder[];

const meta: Meta<typeof DocumentList> = {
  title: "viewer/containers/DocumentList",
  component: DocumentList,
  parameters: { layout: "fullscreen" },
  decorators: [
    Story => (
      <div className="relative h-screen bg-bg-subtle">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    useFolderStore.setState({ isRestored: true, folders: FOLDERS });
    useViewerStore.setState({
      isListOpen: true,
      isListDismissed: false,
      selectedDocument: null,
      favorites: [],
      listView: "all",
      // 「?」 를 누르면 열림 상태만 남는다(이 스토리에는 도움말 창이 없다) — 스토리마다 닫아 둔다
      isHelpOpen: false,
    });
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 열린 목록 — 등록 폴더는 펼쳐 있고 HTML 폴더는 눌러서 펼친다 */
export const Open: Story = {};

/** 보던 문서가 있을 때 — 그 HTML 폴더가 펼쳐 있고 줄이 초록 바탕이다 */
export const WithSelectedDocument: Story = {
  beforeEach: () => {
    useViewerStore.setState({
      selectedDocument: { folderId: "sample", path: "001-create-side-menu", fileName: "플랜.html" },
    });
  },
};

/** 접힌 목록 — 열기 버튼만 남는다 */
export const Closed: Story = {
  beforeEach: () => {
    useViewerStore.setState({ isListOpen: false });
  },
};

/** 등록된 폴더가 없을 때 */
export const NoFolder: Story = {
  beforeEach: () => {
    useFolderStore.setState({ isRestored: true, folders: [] });
  },
};

/** 전체 보기에서 켠 별 — 켜진 줄은 노란 별이 늘 보인다 */
export const WithFavorites: Story = {
  beforeEach: () => {
    useViewerStore.setState({
      favorites: [
        { kind: "htmlFolder", folderId: "sample", path: "001-create-side-menu" },
        { kind: "folder", folderId: "empty" },
      ],
    });
  },
};

/** 즐겨찾기만 보기 — 켠 순서대로. HTML 폴더는 「등록 폴더 / 경로」 이름으로 보인다 */
export const FavoritesView: Story = {
  beforeEach: () => {
    useViewerStore.setState({
      listView: "favorites",
      favorites: [
        { kind: "document", folderId: "sample", path: "001-create-side-menu", fileName: "플랜.html" },
        { kind: "htmlFolder", folderId: "sample", path: "001-create-side-menu" },
        { kind: "folder", folderId: "sample" },
      ],
    });
  },
};

/** 즐겨찾기만 보기 — 즐겨찾기가 없을 때 */
export const FavoritesViewEmpty: Story = {
  beforeEach: () => {
    useViewerStore.setState({ listView: "favorites", favorites: [] });
  },
};
