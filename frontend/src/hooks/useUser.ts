import {
  me as meApi,
  signIn as signInApi,
  signOut as signOutApi,
  signUp as signUpApi,
} from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

import { AuthSchema } from "@/lib/zod";

type Data = {
  _id: string;
  username: AuthSchema["username"];
};

function useUser() {
  const me = useQuery<unknown, { message: string }, Data>({
    queryKey: ["me"],
    queryFn: meApi,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const signUp = useMutation<Data, { message: string }, AuthSchema>({
    mutationKey: ["sign-up"],
    mutationFn: user => signUpApi(user),
  });
  const signIn = useMutation<{ message: string }, { message: string }, AuthSchema>({
    mutationKey: ["sign-in"],
    mutationFn: user => signInApi(user),
  });
  const signOut = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: signOutApi,
  });

  return { me, signUp, signIn, signOut };
}

export default useUser;
