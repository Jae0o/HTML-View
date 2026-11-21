export interface ToastState {
  /** 지금 보이는 알림 글자. 없으면 null */
  message: string | null;
  /** 알림을 띄운다. 이미 떠 있으면 바꿔 보여 주고 시간을 다시 센다 */
  show: (message: string) => void;
  hide: () => void;
}
