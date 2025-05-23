import { LOGIN, LOGOUT, REFRESH_TOKENS, REGISTER_USER } from "@/api/mutation";
import { useSessionStore } from "@/store/session";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useRegisterSync = () => {
  const { newSession, resetSession } = useSessionStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: REGISTER_USER,
    onSuccess: (data) => {
      if (data.user) {
        newSession(data.user.id, data.user.role);
      }
      navigate("/");
    },
    onError: () => {
      resetSession();
    },
  });
};

export const useLoginSync = () => {
  const { newSession, resetSession } = useSessionStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: LOGIN,
    onSuccess: (data) => {
      if (data.user) {
        newSession(data.user.id, data.user.role);
      }
      navigate("/");
    },
    onError: () => {
      resetSession();
    },
  });
};

export const useLogoutSync = () => {
  const { resetSession } = useSessionStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: LOGOUT,
    onSuccess: () => {
      resetSession();
      navigate("/login");
    },
  });
};

export const useRefreshTokenSync = () => {
  const { refreshSession, resetSession } = useSessionStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: REFRESH_TOKENS,
    onSuccess: () => {
      refreshSession();
    },
    onError: () => {
      resetSession();
      navigate("/login");
    },
  });
};
