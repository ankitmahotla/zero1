import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

type SessionState = {
  user_id: string | null;
  role: string | null;
  expiresAt: number | null;

  get isAuthenticated(): boolean;
};

type SessionActions = {
  newSession: (id: string, role: string) => void;
  refreshSession: () => void;
  resetSession: () => void;
};

const InitialState = {
  user_id: null,
  role: null,
  expiresAt: null,
};

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set, get) => ({
      ...InitialState,
      get isAuthenticated() {
        return !!this.user_id;
      },
      newSession: (id, role) => {
        set({ user_id: id, role: role, expiresAt: Date.now() + 86400 * 1000 });
      },
      refreshSession: () =>
        set((state) => ({
          ...state,
          expiresAt: Date.now() + 86400 * 1000,
        })),
      resetSession: () => {
        useSessionStore.persist.clearStorage();
        set(InitialState);
      },
    }),
    {
      name: "session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user_id: state.user_id,
        role: state.role,
        expiresAt: state.expiresAt,
      }),
    },
  ),
);
