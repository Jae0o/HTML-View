import { useId, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import Dialog from "./Dialog";

const meta: Meta<typeof Dialog> = {
  title: "common/components/Dialog",
  component: Dialog,
  parameters: { docs: { disable: true } },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 창 틀만 본다 — 안쪽 여백 · 제목 · 버튼은 쓰는 쪽이 넣는다
const Demo = ({ width }: { width: "s" | "m" }) => {
  const [open, setOpen] = useState(true);
  const titleId = useId();

  return (
    <>
      <Button onClick={() => setOpen(true)}>창 열기</Button>
      <Dialog
        open={open}
        width={width}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
      >
        <div className="flex flex-col gap-24 p-24">
          <h2
            id={titleId}
            className="m-0 text-base font-semibold"
          >
            창 제목
          </h2>
          <p className="m-0 text-sm text-text-secondary">Esc 를 누르거나 닫기를 누르면 닫힌다.</p>
          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)}>닫기</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

/** 확인 창 폭(360px) */
export const Small: Story = { render: () => <Demo width="s" /> };

/** 도움말 창 폭(480px) */
export const Medium: Story = { render: () => <Demo width="m" /> };
