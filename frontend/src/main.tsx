import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import { ReactFlowProvider } from "@xyflow/react";
import { ThemeProvider } from "@/components/ThemeProvider.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <ThemeProvider
          defaultTheme="light"
          storageKey="vite-ui-theme"
        >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </ReactFlowProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
