import { Button, Tag } from "@views/components/common";
import { FileHtmlIcon, FolderIcon } from "@views/components/icons";

import type { Meta, StoryObj } from "@storybook/react-vite";

import TreeRow from "./TreeRow";

const meta: Meta<typeof TreeRow> = {
  title: "viewer/components/TreeRow",
  component: TreeRow,
  args: { onClick: () => {} },
  decorators: [
    Story => (
      <div className="w-[33.6rem]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 등록 폴더 — 펼쳐진 상태 */
export const Folder: Story = {
  args: {
    depth: 0,
    label: "sample-project",
    expanded: true,
    icon: <FolderIcon className="shrink-0 text-brand-bg" />,
  },
};

/** HTML 폴더 — 접힌 상태 · 문서 개수 꼬리표 */
export const HtmlFolder: Story = {
  args: { depth: 1, label: "common-truncation-counter / completed", expanded: false, trailing: <Tag>3</Tag> },
};

/** 문서 */
export const Document: Story = {
  args: { depth: 2, label: "구현 분석", icon: <FileHtmlIcon className="shrink-0 text-text-tertiary" /> },
};

/** 지금 보고 있는 문서 */
export const SelectedDocument: Story = {
  args: { depth: 2, label: "구현 분석", selected: true, icon: <FileHtmlIcon className="shrink-0" /> },
};

/** 이름이 길면 한 줄로 자르고, 마우스를 올리면 펼친다 */
export const LongLabel: Story = {
  args: {
    depth: 1,
    label: "003-refactor-side-menu-with-a-very-long-folder-name-for-truncation / completed",
    expanded: false,
    trailing: <Tag>12</Tag>,
  },
};

/** 연결이 끊긴 등록 폴더 — 줄은 누를 수 없고 오른쪽 버튼만 눌린다 */
export const Disconnected: Story = {
  args: {
    depth: 0,
    label: "sample-project",
    icon: <FolderIcon className="shrink-0 text-text-tertiary" />,
    actions: <Button variant="text">다시 연결</Button>,
    onClick: undefined,
  },
};
