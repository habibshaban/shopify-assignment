import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { CopilotKit } from "@copilotkit/react-core";
import "./index.css";
import App from "./App.tsx";
import { ErrorFallback } from "./components/ErrorFallback.tsx";

const apiKey = import.meta.env.VITE_COPILOT_API_KEY;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <CopilotKit publicApiKey={apiKey}>
        <App />
      </CopilotKit>
    </ErrorBoundary>
  </StrictMode>
);
