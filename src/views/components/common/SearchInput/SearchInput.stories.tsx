import type { Meta, StoryObj } from "@storybook/react-vite";

import SearchInput from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "common/components/SearchInput",
  component: SearchInput,
  args: { "aria-label": "폴더 검색", placeholder: "폴더 이름 검색", className: "w-[24rem]" },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = { args: { defaultValue: "completed" } };

export const FavoriteView: Story = { args: { "aria-label": "즐겨찾기 검색", placeholder: "즐겨찾기 검색" } };
