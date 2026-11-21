interface ToastMessageProps {
  children: string;
}

/** 토스트 한 줄의 모양 */
const ToastMessage = ({ children }: ToastMessageProps) => (
  <div className="rounded-6 bg-bg-inverse px-16 py-8 text-base text-text-inverse">{children}</div>
);

export default ToastMessage;
