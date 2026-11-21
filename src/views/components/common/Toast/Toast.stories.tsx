import { useToastStore } from "@libs/features/toast";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import Toast from "./Toast";

/** 자리(화면 아래 가운데)와 4초 뒤 사라지는 동작을 본다 — 모양은 ToastMessage 스토리 */
const ToastDemo = () => {
  const show = useToastStore(state => state.show);

  return (
    <div className="flex gap-8">
      <Button onClick={() => show("이 환경에서는 폴더 연결이 저장되지 않습니다.")}>알림 띄우기</Button>
      <Button onClick={() => show("폴더를 다시 연결하지 못했습니다.")}>다른 알림 띄우기</Button>
      <Toast />
    </div>
  );
};

const meta: Meta<typeof ToastDemo> = {
  title: "common/components/Toast",
  component: ToastDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
