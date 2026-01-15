import { create } from "zustand";

export const useAuthStore = create((set) => ({
    token: localStorage.getItem("admin_access_token"),
    refreshToken: localStorage.getItem("admin_refresh_token"),
    user: null,
    isLoading: false,
    error: null,

    setToken: (token) => {
        if (token) {
            localStorage.setItem("admin_access_token", token);
        } else {
            localStorage.removeItem("admin_access_token");
        }
        set({ token });
    },

    setRefreshToken: (refreshToken) => {
        if (refreshToken) {
            localStorage.setItem("admin_refresh_token", refreshToken);
        } else {
            localStorage.removeItem("admin_refresh_token");
        }
        set({ refreshToken });
    },

    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    logout: () => {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        set({ token: null, refreshToken: null, user: null });
    },

    isAuthenticated: () => !!localStorage.getItem("admin_access_token"),
}));
