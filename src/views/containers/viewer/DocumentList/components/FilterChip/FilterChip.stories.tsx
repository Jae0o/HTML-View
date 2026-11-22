import { FileHtmlIcon, MarkdownIcon, StarIcon } from "@views/components/icons";

import type { Meta, StoryObj } from "@storybook/react-vite";

import FilterChip from "./FilterChip";

const meta: Meta<typeof FilterChip> = {
  title: "viewer/containers/DocumentList/FilterChip",
  component: FilterChip,
  args: { label: "HTML", icon: <FileHtmlIcon size={16} />, pressed: true, onClick: () => {} },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 켜짐 — 그 형식의 문서가 목록에 보인다 */
export const On: Story = {};

/** 꺼짐 */
export const Off: Story = { args: { label: "MD", icon: <MarkdownIcon size={16} />, pressed: false } };

/** 켜진 마지막 하나 — 끌 수 없어 흐리게 보인다 */
export const Locked: Story = { args: { disabled: true } };

/** 즐겨찾기 — 켜지면 별만 노랗다 */
export const Favorite: Story = {
  args: {
    label: "즐겨찾기",
    pressed: true,
    icon: (
      <span className="inline-flex text-favorite-on">
        <StarIcon
          size={16}
          fill="currentColor"
        />
      </span>
    ),
  },
};
