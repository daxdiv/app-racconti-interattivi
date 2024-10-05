import type { AuthSchema, PasswordSchema, UsernameSchema } from "@/lib/zod";
import {
  deleteAccount as deleteAccountApi,
  me as meApi,
  setPassword as setPasswordApi,
  setUsername as setUsernameApi,
  signIn as signInApi,
  signOut as signOutApi,
  signUp as signUpApi,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Message = {
  message: string;
};
export type Data = {
  _id: string;
  username: AuthSchema["username"];
};
type SetUsernameVars = UsernameSchema & { userId: string };
type SetPasswordVars = Pick<PasswordSchema, "password" | "newPassword"> & {
  userId: string;
};

function useUser() {
  const queryClient = useQueryClient();
  const me = useQuery<unknown, Message, Data>({
    queryKey: ["me"],
    queryFn: meApi,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const signUp = useMutation<Data, Message, AuthSchema>({
    mutationKey: ["sign-up"],
    mutationFn: signUpApi,
  });
  const signIn = useMutation<Message, Message, AuthSchema>({
    mutationKey: ["sign-in"],
    mutationFn: signInApi,
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: ["me"],
      });
    },
  });
  const signOut = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: signOutApi,
    onSuccess() {
      queryClient.resetQueries({
        queryKey: ["me"],
      });
    },
  });
  const setUsername = useMutation<Message, Message, SetUsernameVars>({
    mutationKey: ["set-username"],
    mutationFn: setUsernameApi,
  });
  const setPassword = useMutation<Message, Message, SetPasswordVars>({
    mutationKey: ["set-password"],
    mutationFn: setPasswordApi,
  });
  const deleteAccount = useMutation<Message, Message, string>({
    mutationKey: ["delete-account"],
    mutationFn: deleteAccountApi,
    onSuccess() {
      queryClient.resetQueries({
        queryKey: ["me"],
      });
    },
  });

  return { me, signUp, signIn, signOut, setUsername, setPassword, deleteAccount };
}

export default useUser;
