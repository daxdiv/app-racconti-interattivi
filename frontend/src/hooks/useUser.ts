import { signIn as signInApi, signOut as signOutApi, signUp as signUpApi } from "@/api";

import { AuthSchema } from "@/lib/zod";
import { useMutation } from "@tanstack/react-query";

function useUser() {
  const signUp = useMutation<unknown, { message: string }, AuthSchema>({
    mutationKey: ["sign-up"],
    mutationFn: user => signUpApi(user),
  });
  const signIn = useMutation<unknown, { message: string }, AuthSchema>({
    mutationKey: ["sign-in"],
    mutationFn: user => signInApi(user),
  });
  const signOut = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: signOutApi,
  });

  return { signUp, signIn, signOut };
}

export default useUser;
