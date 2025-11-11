import { create } from "zustand";
import { supabase } from "../config/supabase";
import { AuthState, User } from "../types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user: User | null) => set({ user, loading: false }),
  setLoading: (loading: boolean) => set({ loading }),
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },
}));
