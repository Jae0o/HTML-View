import type { InputHTMLAttributes } from "react";

export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "aria-label" | "className"
> {
  /** 보이는 라벨이 없어 읽어 주는 이름을 반드시 받는다 */
  "aria-label": string;
}
