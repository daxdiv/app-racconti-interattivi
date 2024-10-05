import type { Data } from "@/hooks/useUser";

type UserFlowsProps = {
  data: Data;
  isLoading: boolean;
};

function UserFlows(user: UserFlowsProps) {
  console.log(user);

  return <div>UserFlows</div>;
}

export default UserFlows;
