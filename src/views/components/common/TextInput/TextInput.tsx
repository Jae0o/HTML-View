import type { TextInputProps } from "./TextInput.types";

/** 글자 입력 칸 — 모양은 검색 칸과 같다(높이 32px · 둥글기 6px · 포커스 때 진한 테두리). 폭은 감싼 칸을 채운다 */
const TextInput = (props: TextInputProps) => (
  <input
    {...props}
    type="text"
    autoComplete="off"
    className="h-32 w-full min-w-0 rounded-6 border border-border-default bg-surface-default px-10 text-base text-text-primary transition-colors outline-none placeholder:text-text-placeholder focus:border-text-primary"
  />
);

export default TextInput;
