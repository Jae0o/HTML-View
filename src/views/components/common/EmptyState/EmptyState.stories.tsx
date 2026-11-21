import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import EmptyState from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "common/components/EmptyState",
  component: EmptyState,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NoFolder: Story = {
  args: {
    title: "등록된 폴더가 없습니다",
    description: "HTML 문서가 든 폴더를 추가하면 목록에 모아 보여 줍니다.",
    actions: (
      <>
        <Button variant="primary">폴더 추가</Button>
        <Button variant="text">예시 폴더 넣기</Button>
      </>
    ),
  },
};

export const NoDocument: Story = {
  args: { title: "선택된 문서가 없습니다", description: "목록에서 문서를 고르면 여기에 열립니다." },
};

export const DocumentError: Story = {
  args: {
    tone: "muted",
    title: "문서를 열 수 없습니다",
    description: "파일이 옮겨졌거나 지워졌을 수 있습니다. 폴더 연결이 끊긴 경우에도 열리지 않습니다.",
    actions: (
      <>
        <Button variant="primary">다시 시도</Button>
        <Button>목록 열기</Button>
      </>
    ),
  },
};

export const Disconnected: Story = {
  args: {
    tone: "muted",
    title: "폴더 연결이 끊겼습니다",
    description: "브라우저를 다시 열면 폴더 읽기 권한이 풀릴 수 있습니다. 다시 연결하면 목록이 돌아옵니다.",
    actions: <Button variant="primary">다시 연결</Button>,
  },
};
