import type { Meta, StoryObj } from "@storybook/react-vite";

/** 디자인 토큰 확인용 — 색 칩 · 글자 크기. 값은 src/index.css 의 @theme 이 원본이다 */
/** 칩 클래스는 글자 그대로 적는다 — Tailwind 가 소스에서 찾은 클래스만 만들기 때문이다 */
const COLORS = [
  { name: "bg-canvas", chip: "bg-bg-canvas" },
  { name: "surface-default", chip: "bg-surface-default" },
  { name: "surface-hover", chip: "bg-surface-hover" },
  { name: "text-primary", chip: "bg-text-primary" },
  { name: "text-secondary", chip: "bg-text-secondary" },
  { name: "text-tertiary", chip: "bg-text-tertiary" },
  { name: "border-default", chip: "bg-border-default" },
  { name: "brand-bg-subtle", chip: "bg-brand-bg-subtle" },
  { name: "brand-bg-muted", chip: "bg-brand-bg-muted" },
  { name: "brand-bg", chip: "bg-brand-bg" },
  { name: "brand-bg-active", chip: "bg-brand-bg-active" },
  { name: "favorite-on", chip: "bg-favorite-on" },
  { name: "danger-bg", chip: "bg-danger-bg" },
] as const;

const Tokens = () => (
  <div className="flex flex-col gap-24 p-24">
    <section className="grid grid-cols-4 gap-12">
      {COLORS.map(({ name, chip }) => (
        <div
          key={name}
          className="flex items-center gap-8"
        >
          <span className={`size-24 rounded-6 border border-border-default ${chip}`} />
          <span className="text-sm text-text-secondary">{name}</span>
        </div>
      ))}
    </section>
    <section className="flex flex-col gap-8">
      <p className="m-0 text-base">기본 13px — 메뉴 줄 · 버튼 · 문서 제목</p>
      <p className="m-0 text-sm">보조 12px — 구역 제목 · 꼬리표 · 설명</p>
      <p className="m-0 text-logo font-bold">로고 16px — Docs</p>
    </section>
  </div>
);

const meta: Meta<typeof Tokens> = {
  title: "storybook/Tokens",
  component: Tokens,
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
