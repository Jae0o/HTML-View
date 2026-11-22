import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChevronRightIcon } from "./ChevronRightIcon";
import { CloseIcon } from "./CloseIcon";
import { CopyIcon } from "./CopyIcon";
import { DownloadIcon } from "./DownloadIcon";
import { FileHtmlIcon } from "./FileHtmlIcon";
import { FolderIcon } from "./FolderIcon";
import { FolderPlusIcon } from "./FolderPlusIcon";
import { HelpIcon } from "./HelpIcon";
import { MarkdownIcon } from "./MarkdownIcon";
import { MenuIcon } from "./MenuIcon";
import { MoreIcon } from "./MoreIcon";
import { RefreshIcon } from "./RefreshIcon";
import { SearchIcon } from "./SearchIcon";
import { StarIcon } from "./StarIcon";

/** 아이콘 11종을 한 화면에서 본다 — 크기는 쓰는 자리의 값(16px · 폴더와 문서는 20px)이다 */
const ICONS = [
  { name: "ChevronRightIcon", icon: <ChevronRightIcon size={16} /> },
  { name: "CloseIcon", icon: <CloseIcon size={16} /> },
  { name: "CopyIcon", icon: <CopyIcon size={16} /> },
  { name: "DownloadIcon", icon: <DownloadIcon size={16} /> },
  { name: "FileHtmlIcon", icon: <FileHtmlIcon size={20} /> },
  { name: "FolderIcon", icon: <FolderIcon size={20} /> },
  { name: "FolderPlusIcon", icon: <FolderPlusIcon size={16} /> },
  { name: "HelpIcon", icon: <HelpIcon size={16} /> },
  { name: "MarkdownIcon", icon: <MarkdownIcon size={20} /> },
  { name: "MenuIcon", icon: <MenuIcon size={16} /> },
  { name: "MoreIcon", icon: <MoreIcon size={16} /> },
  { name: "RefreshIcon", icon: <RefreshIcon size={16} /> },
  { name: "SearchIcon", icon: <SearchIcon size={16} /> },
  { name: "StarIcon", icon: <StarIcon size={16} /> },
];

const Icons = () => (
  <div className="grid grid-cols-4 gap-16 p-24">
    {ICONS.map(({ name, icon }) => (
      <div
        key={name}
        className="flex items-center gap-8 text-text-secondary"
      >
        {icon}
        <span className="text-sm">{name}</span>
      </div>
    ))}
    <div className="flex items-center gap-8 text-favorite-on">
      <StarIcon
        size={16}
        fill="currentColor"
      />
      <span className="text-sm text-text-secondary">StarIcon (켜짐)</span>
    </div>
  </div>
);

const meta: Meta<typeof Icons> = {
  title: "icons/components/Icons",
  component: Icons,
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
