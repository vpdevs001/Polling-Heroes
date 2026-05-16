import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import * as authApi from "../api/auth.api.js";
import type { AuthUser } from "../types/index.js";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    })();
  }, [refreshUser]);

  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await authApi.login({ email, password });
      if (!res.success || !res.data?.user) {
        throw new Error(res.message || "Login failed");
      }
      setUser(res.data.user);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg = (e.response?.data as { message?: string } | undefined)
          ?.message;
        throw new Error(typeof msg === "string" ? msg : "Login failed", {
          cause: e,
        });
      }
      throw e;
    }
  }, []);

  const register = useCallback(
    async (payload: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      try {
        const res = await authApi.register(payload);
        if (!res.success || !res.data?.user) {
          throw new Error(res.message || "Registration failed");
        }
        setUser(res.data.user);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          const msg = (e.response?.data as { message?: string } | undefined)
            ?.message;
          throw new Error(
            typeof msg === "string" ? msg : "Registration failed",
            { cause: e },
          );
        }
        throw e;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}
