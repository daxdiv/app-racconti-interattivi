import "@xyflow/react/dist/style.css";
import "@/styles/globals.css";

import Flow from "@/components/Flow";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Flow />
      <Toaster
        toastOptions={{
          className:
            "bg-primary dark:bg-secondary dark:text-primary dark:border dark:border-white",
        }}
      />
    </>
  );
}

export default App;
