import { type RegisteredFolder, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import type { Meta, StoryObj } from "@storybook/react-vite";

import ViewerBody from "./ViewerBody";

const SAMPLE_HTML =
  '<h1>스토리용 문서</h1><p>고른 문서가 본문 전체에 열린다.</p><p><a href="#end">같은 문서 안 이동</a> · <a href="other.html">다른 파일 링크 (눌러도 아무 일도 없다)</a></p><p id="end">문서 끝</p>';

// 스토리용 등록 폴더 — 문서 한 개가 들어 있고, 읽으면 위 HTML 이 나온다
const SAMPLE_FOLDER = {
  id: "sample",
  name: "sample-project",
  status: "connected",
  htmlFolders: [
    {
      path: "plan-a",
      documents: [
        {
          name: "결과",
          fileName: "결과.html",
          handle: { getFile: async () => new File([SAMPLE_HTML], "결과.html") },
        },
      ],
    },
  ],
} as unknown as RegisteredFolder;

const meta: Meta<typeof ViewerBody> = {
  title: "viewer/containers/ViewerBody",
  component: ViewerBody,
  parameters: { layout: "fullscreen" },
  // 「사용 방법 보기」 를 누르면 열림 상태만 남는다(이 스토리에는 도움말 창이 없다) — 스토리마다 닫아 둔다
  beforeEach: () => {
    useViewerStore.setState({ isHelpOpen: false });
  },
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

// 목록이 접힌 상태 — 빈 화면에 「목록 열기」 버튼이 보인다
const LIST_CLOSED = { isListOpen: false, isListDismissed: false };

/** 등록된 폴더가 없다 — 「폴더 추가」 를 누르면 폴더 선택 창이 뜬다 */
export const NoFolder: Story = {
  beforeEach: () => {
    useFolderStore.setState({ isRestored: true, folders: [] });
    useViewerStore.setState({ ...LIST_CLOSED, selectedDocument: null });
  },
};

/** 폴더는 있고 문서를 고르지 않았다 — 목록이 접혀 있어 「목록 열기」 버튼이 보인다 */
export const NoDocument: Story = {
  beforeEach: () => {
    useFolderStore.setState({ isRestored: true, folders: [SAMPLE_FOLDER] });
    useViewerStore.setState({ ...LIST_CLOSED, selectedDocument: null });
  },
};

/** 목록이 열려 있을 때 — 빈 화면은 그대로 본문 한가운데에 있고 「목록 열기」 버튼은 없다 */
export const NoDocumentListOpen: Story = {
  beforeEach: () => {
    useFolderStore.setState({ isRestored: true, folders: [SAMPLE_FOLDER] });
    useViewerStore.setState({ isListOpen: true, isListDismissed: false, selectedDocument: null });
  },
};

/** 고른 문서가 본문 전체에 열린다 */
export const DocumentShown: Story = {
  beforeEach: () => {
    useFolderStore.setState({ isRestored: true, folders: [SAMPLE_FOLDER] });
    useViewerStore.setState({
      ...LIST_CLOSED,
      selectedDocument: { folderId: "sample", path: "plan-a", fileName: "결과.html" },
    });
  },
};

/** 고른 문서를 찾지 못했다 (옮겨짐 · 지워짐) — 「다시 시도」 는 그 폴더를 다시 훑는다 */
export const DocumentError: Story = {
  beforeEach: () => {
    useFolderStore.setState({ isRestored: true, folders: [SAMPLE_FOLDER] });
    useViewerStore.setState({
      ...LIST_CLOSED,
      selectedDocument: { folderId: "sample", path: "plan-a", fileName: "없는 문서.html" },
    });
  },
};

/** 등록 폴더의 연결이 끊겼다 — 「다시 연결」 은 읽기 권한을 다시 묻는다 */
export const Disconnected: Story = {
  beforeEach: () => {
    useFolderStore.setState({
      isRestored: true,
      folders: [{ ...SAMPLE_FOLDER, status: "disconnected", htmlFolders: [] }],
    });
    useViewerStore.setState({ ...LIST_CLOSED, selectedDocument: null });
  },
};
