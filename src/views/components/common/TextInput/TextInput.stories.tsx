import type { Meta, StoryObj } from "@storybook/react-vite";

import TextInput from "./TextInput";

const meta: Meta<typeof TextInput> = {
  title: "common/components/TextInput",
  component: TextInput,
  args: { "aria-label": "폴더 이름", placeholder: "sample-project" },
  decorators: [
    Story => (
      <div className="w-[31.2rem]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 비어 있으면 흐린 글자(placeholder)가 보인다 */
export const Empty: Story = {};

export const Filled: Story = { args: { defaultValue: "기획 문서함" } };
