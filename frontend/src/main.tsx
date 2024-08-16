import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { ReactFlowProvider } from "@xyflow/react";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
