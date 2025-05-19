import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

type SessionState = {
  user_id: string | null;
  expiresAt: number | null;

  get isAuthenticated(): boolean;
};

type SessionActions = {
  newSession: (id: string) => void;
  refreshSession: () => void;
  resetSession: () => void;
};

const InitialState = {
  user_id: null,
  expiresAt: null,
};

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set, get) => ({
      ...InitialState,
      get isAuthenticated() {
        return !!this.user_id;
      },
      newSession: (id: string) => {
        set({ user_id: id, expiresAt: Date.now() + 86400 * 1000 });
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
        expiresAt: state.expiresAt,
      }),
    },
  ),
);
