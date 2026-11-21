import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ErrorBoundary, Toast } from "@views/components/common";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <Toast />
    </ErrorBoundary>
  </StrictMode>,
);
