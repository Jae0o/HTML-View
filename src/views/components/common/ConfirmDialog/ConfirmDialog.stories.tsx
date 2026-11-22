import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import { TextInput } from "../TextInput";
import ConfirmDialog from "./ConfirmDialog";

const meta: Meta<typeof ConfirmDialog> = {
  title: "common/components/ConfirmDialog",
  component: ConfirmDialog,
  args: {
    open: true,
    tone: "danger",
    title: "등록을 해제할까요?",
    description:
      "「sample-project」 폴더가 목록에서 빠집니다. 파일은 지워지지 않고, 이 폴더의 즐겨찾기는 함께 지워집니다.",
    confirmLabel: "해제",
    onConfirm: () => {},
    onCancel: () => {},
  },
  parameters: { docs: { disable: true } },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** 등록 해제 확인 */
export const Danger: Story = {};

/** 입력 칸을 둔 창 — 열리면 입력 칸에 포커스가 간다 */
export const WithInput: Story = {
  args: {
    tone: "default",
    title: "폴더 이름 변경",
    description: "0Docs 목록에만 보이는 이름입니다. 실제 폴더 이름은 바뀌지 않습니다.",
    confirmLabel: "변경",
    children: (
      <TextInput
        aria-label="폴더 이름"
        defaultValue="sample-project"
      />
    ),
  },
};

/** 버튼으로 열고 취소 · Esc · 확인으로 닫는다 */
export const OpenAndClose: Story = {
  render: args => {
    const Demo = () => {
      const [open, setOpen] = useState(false);

      return (
        <>
          <Button onClick={() => setOpen(true)}>등록 해제</Button>
          <ConfirmDialog
            {...args}
            open={open}
            onConfirm={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </>
      );
    };

    return <Demo />;
  },
};
