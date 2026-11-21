import { Component } from "react";

import { ErrorFallback } from "../ErrorFallback";
import type { ErrorBoundaryProps } from "./ErrorBoundary.types";

interface ErrorBoundaryState {
  hasError: boolean;
}

/** 아래 화면을 그리다 오류가 나면 오류 화면으로 바꾼다. 오류 경계는 클래스로만 만들 수 있다 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? <ErrorFallback /> : this.props.children;
  }
}

export default ErrorBoundary;
