import "@xyflow/react/dist/style.css";
import "@/styles/globals.css";

import { Navigate, Route, Routes } from "react-router-dom";

import Auth from "@/pages/Auth";
import Flow from "@/pages/Flow";
import Profile from "@/pages/Profile";
import Protected from "@/components/Protected";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Auth />}
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route
          path="flow"
          element={
            <Protected>
              <Flow />
            </Protected>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
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
