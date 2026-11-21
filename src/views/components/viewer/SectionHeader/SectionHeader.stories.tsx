import { IconButton } from "@views/components/common";
import { FolderPlusIcon } from "@views/components/icons";

import type { Meta, StoryObj } from "@storybook/react-vite";

import SectionHeader from "./SectionHeader";

const meta: Meta<typeof SectionHeader> = {
  title: "viewer/components/SectionHeader",
  component: SectionHeader,
  args: { title: "등록 폴더" },
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

export const TitleOnly: Story = {};

/** 제목 옆 폴더 추가 */
export const WithAction: Story = {
  args: {
    action: (
      <IconButton
        size="s"
        aria-label="폴더 추가"
        icon={<FolderPlusIcon />}
      />
    ),
  },
};
