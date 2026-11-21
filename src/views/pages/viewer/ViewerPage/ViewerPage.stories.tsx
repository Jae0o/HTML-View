import type { Meta, StoryObj } from "@storybook/react-vite";

import ViewerPage from "./ViewerPage";

const meta: Meta<typeof ViewerPage> = {
  title: "viewer/pages/ViewerPage",
  component: ViewerPage,
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 실제 브라우저 저장소를 읽는다 — 이 브라우저에 등록해 둔 폴더 · 보던 문서가 있으면 그대로 보인다 */
export const Default: Story = {};
