import { IconButton } from "@views/components/common";
import { DownloadIcon } from "@views/components/icons";

import type { Meta, StoryObj } from "@storybook/react-vite";

import ViewerLayout from "./ViewerLayout";

const meta: Meta<typeof ViewerLayout> = {
  title: "layouts/ViewerLayout",
  component: ViewerLayout,
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 흰 본문 위 — 로고가 오른쪽 위에 뜬다 */
export const Default: Story = { args: { children: null } };

/** 문서를 연 화면 — 로고 왼쪽 8px 에 다운로드 버튼이 붙는다 */
export const WithActions: Story = {
  args: {
    children: null,
    actions: (
      <IconButton
        floating
        aria-label="다운로드"
        icon={<DownloadIcon />}
      />
    ),
  },
};

/** 어두운 본문 위 — 흰 번짐 그림자로 로고가 읽힌다 */
export const OnDarkBody: Story = {
  args: { children: <div className="h-full bg-bg-inverse" /> },
};
