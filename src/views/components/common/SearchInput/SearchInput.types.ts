import type { InputHTMLAttributes, Ref } from "react";

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "aria-label"> {
  /** 보이는 라벨이 없어 읽어 주는 이름을 반드시 받는다 */
  "aria-label": string;
  ref?: Ref<HTMLInputElement>;
}
