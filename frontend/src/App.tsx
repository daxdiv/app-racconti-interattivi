import "@xyflow/react/dist/style.css";
import "@/styles/globals.css";

import { Navigate, Route, Routes } from "react-router-dom";

import Auth from "@/pages/Auth";
import Flow from "@/pages/Flow";
import Protected from "@/components/Protected";
import { Toaster } from "react-hot-toast";
import UserFlows from "@/pages/user/flows/UserFlows";
import UserProfile from "@/pages/user/profile/UserProfile";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Protected>{me => <UserFlows {...me} />}</Protected>}
        />
        <Route
          path="/auth"
          element={<Auth />}
        />
        <Route
          path="user/profile"
          element={<Protected>{me => <UserProfile {...me} />}</Protected>}
        />
        <Route
          path="user/flows"
          element={<Protected>{me => <UserFlows {...me} />}</Protected>}
        />
        <Route
          path="flow/:flowId"
          element={<Protected>{() => <Flow />}</Protected>}
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
