import { CloseIcon, FolderPlusIcon, MenuIcon, StarIcon } from "@views/components/icons";

import type { Meta, StoryObj } from "@storybook/react-vite";

import IconButton from "./IconButton";

const meta: Meta<typeof IconButton> = {
  title: "common/components/IconButton",
  component: IconButton,
  args: { "aria-label": "목록 접기", icon: <MenuIcon /> },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Outline: Story = {};

export const Ghost: Story = { args: { variant: "ghost", "aria-label": "폴더 추가", icon: <FolderPlusIcon /> } };

export const Floating: Story = { args: { floating: true, "aria-label": "목록 열기" } };

export const ToggleOff: Story = { args: { pressed: false, "aria-label": "즐겨찾기만 보기", icon: <StarIcon /> } };

export const ToggleOn: Story = {
  args: { pressed: true, "aria-label": "즐겨찾기만 보기", icon: <StarIcon fill="currentColor" /> },
};

/** 목록 줄 안에서 쓰는 작은 크기 — 별(꺼짐 · 켜짐) · 등록 해제 */
export const Small: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <IconButton
        size="s"
        pressed={false}
        aria-label="즐겨찾기"
        icon={<StarIcon />}
      />
      <IconButton
        size="s"
        pressed
        aria-label="즐겨찾기"
        icon={<StarIcon fill="currentColor" />}
      />
      <IconButton
        size="s"
        aria-label="등록 해제"
        icon={<CloseIcon />}
      />
    </div>
  ),
};
