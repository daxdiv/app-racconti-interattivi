import "@xyflow/react/dist/style.css";
import "@/styles/globals.css";

import { Navigate, Route, Routes } from "react-router-dom";

import Auth from "@/pages/Auth";
import Protected from "@/components/Protected";
import { Toaster } from "react-hot-toast";
import UserFlows from "@/pages/user/UserFlows";
import UserProfile from "@/pages/user/UserProfile";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
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
