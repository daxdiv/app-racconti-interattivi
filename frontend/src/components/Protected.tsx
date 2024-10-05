import { LoaderCircle } from "lucide-react";
import { Navigate } from "react-router-dom";
import useUser, { type Data } from "@/hooks/useUser";

type ProtectedProps = {
  children: (props: { data: Data; isLoading: boolean }) => React.ReactNode;
};

function Protected({ children }: ProtectedProps) {
  const { me } = useUser();

  if (me.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }
  if (me.isError) {
    return (
      <Navigate
        to={`/?error=${me.error.message}`}
        replace
      />
    );
  }

  return children({ data: me.data!, isLoading: me.isLoading });
}

export default Protected;
