import { useViewerStore } from "@libs/features/viewer";

import type { Meta, StoryObj } from "@storybook/react-vite";

import FavoriteButton from "./FavoriteButton";

const meta: Meta<typeof FavoriteButton> = {
  title: "viewer/containers/DocumentList/FavoriteButton",
  component: FavoriteButton,
  args: { item: { kind: "folder", folderId: "sample" }, name: "sample" },
  // 꺼진 별은 줄(group)에 마우스를 올려야 보인다
  decorators: [
    Story => (
      <div className="group flex h-32 w-[20rem] items-center justify-end rounded-6 pr-8 hover:bg-brand-bg-subtle">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    useViewerStore.setState({ favorites: [] });
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 꺼짐 — 줄에 마우스를 올리면 보인다 */
export const Off: Story = {};

/** 켜짐 — 노란 별이 늘 보인다 */
export const On: Story = {
  beforeEach: () => {
    useViewerStore.setState({ favorites: [{ kind: "folder", folderId: "sample" }] });
  },
};
