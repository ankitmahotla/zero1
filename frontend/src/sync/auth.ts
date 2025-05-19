import { REGISTER_USER } from "@/api/mutation";
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
