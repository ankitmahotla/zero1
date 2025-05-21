import { LOGIN, LOGOUT, REFRESH_TOKENS, REGISTER_USER } from "@/api/mutation";
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

export const useLogoutSync = () => {
  const { resetSession } = useSessionStore();
  return useMutation({
    mutationFn: LOGOUT,
    onSuccess: () => {
      resetSession();
    },
  });
};

export const useRefreshTokenSync = () => {
  const { refreshSession, resetSession } = useSessionStore();
  return useMutation({
    mutationFn: REFRESH_TOKENS,
    onSuccess: () => {
      refreshSession();
    },
    onError: () => {
      resetSession();
    },
  });
};
