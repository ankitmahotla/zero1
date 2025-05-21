import { LOGIN, REGISTER_USER } from "@/api/mutation";
import { useSessionStore } from "@/store/session";
import { useMutation } from "@tanstack/react-query";

export const useRegisterSync = () => {
  const { newSession, resetSession } = useSessionStore();
  return useMutation({
    mutationFn: REGISTER_USER,
    onSuccess: (data) => {
      if (data.user) {
        newSession(data.user.id);
      }
    },
    onError: () => {
      resetSession();
    },
  });
};

export const useLoginSync = () => {
  const { newSession, resetSession } = useSessionStore();
  return useMutation({
    mutationFn: LOGIN,
    onSuccess: (data) => {
      if (data.user) {
        newSession(data.user.id);
      }
    },
    onError: () => {
      resetSession();
    },
  });
};
