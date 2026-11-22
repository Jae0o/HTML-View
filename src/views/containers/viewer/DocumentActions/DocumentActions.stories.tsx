import { type RegisteredFolder, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import { Toast } from "@views/components/common";

import type { Meta, StoryObj } from "@storybook/react-vite";

import DocumentActions from "./DocumentActions";

const SAMPLE_HTML = "<h1>스토리용 문서</h1><p>내려받으면 이 HTML 이 든 파일이 저장된다.</p>";

// 스토리용 등록 폴더 — 문서 한 개가 들어 있고, 읽으면 위 HTML 이 든 파일이 나온다
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
          handle: { getFile: async () => new File([SAMPLE_HTML], "결과.html", { type: "text/html" }) },
        },
      ],
    },
  ],
} as unknown as RegisteredFolder;

const meta: Meta<typeof DocumentActions> = {
  title: "viewer/containers/DocumentActions",
  component: DocumentActions,
  parameters: { layout: "fullscreen" },
  decorators: [
    Story => (
      <div className="relative h-screen bg-bg-subtle">
        <div className="absolute top-12 right-16 flex h-32 items-center gap-8">
          <Story />
        </div>
        <Toast />
      </div>
    ),
  ],
  beforeEach: () => {
    useFolderStore.setState({ isRestored: true, folders: [SAMPLE_FOLDER] });
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 문서를 연 상태 — 「다운로드」 를 누르면 결과.html 이 내려받아진다 */
export const Opened: Story = {
  beforeEach: () => {
    useViewerStore.setState({ selectedDocument: { folderId: "sample", path: "plan-a", fileName: "결과.html" } });
  },
};

/** 문서를 고르지 않았다 — 버튼이 없다 */
export const NoDocument: Story = {
  beforeEach: () => {
    useViewerStore.setState({ selectedDocument: null });
  },
};
