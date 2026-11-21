import { SearchIcon } from "@views/components/icons";

import type { SearchInputProps } from "./SearchInput.types";

import clsx from "clsx";

const SearchInput = ({ className, ref, ...rest }: SearchInputProps) => (
  <label
    className={clsx(
      "flex h-32 min-w-0 items-center gap-6 rounded-6 border border-border-default bg-surface-default px-10 text-text-tertiary transition-colors focus-within:border-text-primary",
      className,
    )}
  >
    <SearchIcon size={16} />
    {/* 포커스 표시는 바깥 상자 테두리가 맡는다 — 입력 칸 자체의 테두리선은 끈다 */}
    <input
      {...rest}
      ref={ref}
      type="search"
      autoComplete="off"
      className="min-w-0 flex-1 appearance-none bg-transparent p-0 text-base text-text-primary outline-none placeholder:text-text-placeholder [&::-webkit-search-cancel-button]:appearance-none"
    />
  </label>
);

export default SearchInput;
