import { type RegisteredFolder, useFolderStore } from "@libs/features/folder";
import { useViewerStore } from "@libs/features/viewer";

import type { Meta, StoryObj } from "@storybook/react-vite";

import ViewerBody from "./ViewerBody";

const SAMPLE_HTML =
  '<h1>스토리용 문서</h1><p>고른 문서가 본문 전체에 열린다.</p><p><a href="#end">같은 문서 안 이동</a> · <a href="other.html">다른 파일 링크 (눌러도 아무 일도 없다)</a></p><p id="end">문서 끝</p>';

// MD 문서 견본 — 머리말 · 표 · 체크 · 각주 · 인용 · 긴 코드 줄 · 제목 링크
const SAMPLE_MD = [
  "---",
  "name: folder-hide",
  "paths:",
  "  - src/**/*.tsx",
  "---",
  "# 폴더 숨기기 구현 플랜",
  "",
  "목록에서 필요 없는 폴더를 빼고 다시 보이게 합니다.[^1] [태스크로 이동](#태스크)",
  "",
  "## 태스크",
  "",
  "| ID | 무엇 | 상태 |",
  "| --- | --- | --- |",
  "| EX-01 | 훑기 규칙 | 완료 |",
  "| EX-02 | 숨긴 경로 | ~~진행 중~~ 완료 |",
  "",
  "- [x] 테스트 84개 통과",
  "- [ ] 화면 눈으로 확인",
  "",
  "> 숨긴 폴더는 기기에만 기억합니다.",
  "",
  "```",
  "const isHiddenPath = (path: string, hiddenPaths: string[]): boolean => hiddenPaths.some(hidden => path === hidden || path.startsWith(hidden));",
  "```",
  "",
  "[^1]: 실제 파일은 그대로입니다.",
].join("\n");

// 그림 든 문서 견본 — HTML 은 <img>, MD 는 ![]() 로 같은 폴더의 img/diagram.svg 를 쓴다
const SAMPLE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80"><rect width="240" height="80" rx="8" fill="#d1fae5"/><text x="120" y="46" text-anchor="middle" font-size="16" fill="#047857">img/diagram.svg</text></svg>';
const SAMPLE_IMAGE_MD =
  "# 그림 든 문서\n\n같은 폴더의 그림 파일이 보입니다.\n\n![구성도](img/diagram.svg)\n\n등록 폴더 밖 그림은 빈 자리입니다.\n\n![밖](../../outside.png)";

// 스토리용 등록 폴더 연결 — plan-a/img/diagram.svg 하나가 있다. 연결이 없는 견본은 그림 없이 열린다
const SAMPLE_ROOT = {
  name: "sample-project",
  getDirectoryHandle: async (name: string) => {
    if (name === "plan-a") return SAMPLE_ROOT_PLAN;
    throw new Error("없음");
  },
};
const SAMPLE_ROOT_PLAN = {
  getDirectoryHandle: async (name: string) => {
    if (name === "img")
      return {
        getFileHandle: async () => ({
          getFile: async () => new File([SAMPLE_SVG], "diagram.svg", { type: "image/svg+xml" }),
        }),
      };
    throw new Error("없음");
  },
};

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
        {
          name: "플랜",
          fileName: "플랜.md",
          handle: { getFile: async () => new File([SAMPLE_MD], "플랜.md") },
        },
        {
          name: "그림",
          fileName: "그림.md",
          handle: { getFile: async () => new File([SAMPLE_IMAGE_MD], "그림.md") },
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

/** MD 문서 — 가운데 읽기 칸에 머리말 상자 · 표 · 체크 · 각주가 서식대로 열린다 */
export const MarkdownShown: Story = {
  beforeEach: () => {
    useFolderStore.setState({ isRestored: true, folders: [SAMPLE_FOLDER] });
    useViewerStore.setState({
      ...LIST_CLOSED,
      selectedDocument: { folderId: "sample", path: "plan-a", fileName: "플랜.md" },
    });
  },
};

/** 그림 든 문서 — 같은 등록 폴더의 그림 파일을 읽어 넣는다. 등록 폴더 밖 그림은 빈 자리 */
export const WithLocalImage: Story = {
  beforeEach: () => {
    useFolderStore.setState({
      isRestored: true,
      folders: [{ ...SAMPLE_FOLDER, handle: SAMPLE_ROOT } as unknown as RegisteredFolder],
    });
    useViewerStore.setState({
      ...LIST_CLOSED,
      selectedDocument: { folderId: "sample", path: "plan-a", fileName: "그림.md" },
    });
  },
};

// 다시 읽는 중 견본 — 처음 읽기는 바로 끝나고, 그 뒤 읽기는 끝나지 않는다
let reloadingReads = 0;
const RELOADING_FOLDER = {
  ...SAMPLE_FOLDER,
  htmlFolders: [
    {
      path: "plan-a",
      documents: [
        {
          name: "다시 읽기",
          fileName: "다시 읽기.html",
          handle: {
            getFile: () =>
              reloadingReads++ === 0
                ? Promise.resolve(new File([SAMPLE_HTML], "다시 읽기.html"))
                : new Promise<File>(() => {}),
          },
        },
      ],
    },
  ],
} as unknown as RegisteredFolder;

/** 새로고침 중 — 보던 문서 위 가운데에 도는 표시가 겹친다(문서는 그대로) */
export const Reloading: Story = {
  beforeEach: () => {
    reloadingReads = 0;
    useFolderStore.setState({ isRestored: true, folders: [RELOADING_FOLDER] });
    useViewerStore.setState({
      ...LIST_CLOSED,
      selectedDocument: { folderId: "sample", path: "plan-a", fileName: "다시 읽기.html" },
    });
  },
  play: async ({ canvas }) => {
    await canvas.findByTitle("다시 읽기");
    useViewerStore.getState().reloadDocument();
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
