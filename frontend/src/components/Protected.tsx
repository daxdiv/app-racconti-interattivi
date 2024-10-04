import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUser from "@/hooks/useUser";

type ProtectedProps = {
  children: React.ReactNode;
};

function Protected({ children }: ProtectedProps) {
  const navigate = useNavigate();
  const { me } = useUser();

  if (me.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle className="animate-spin text-white" />
      </div>
    );
  }
  if (me.isError) {
    navigate(`/?error=${me.error.message}`, { replace: true });

    return null;
  }

  return children;
}

export default Protected;
