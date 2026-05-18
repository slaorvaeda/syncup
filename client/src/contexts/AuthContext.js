"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMe, login as apiLogin, register as apiRegister } from "@/lib/api";
import {
  clearAuth,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from "@/lib/storage";
import { toast } from "@/lib/toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const cached = getStoredUser();
    if (cached) setUser(cached);

    try {
      const res = await getMe();
      setUser(res.data);
      setStoredUser(res.data);
    } catch {
      clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = useCallback(async (credentials) => {
    const res = await apiLogin(credentials);
    setToken(res.data.token);
    setStoredUser(res.data.user);
    setUser(res.data.user);
    toast.success("Signed in successfully");
    return res.data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await apiRegister(payload);
    setToken(res.data.token);
    setStoredUser(res.data.user);
    setUser(res.data.user);
    toast.success("Account created successfully");
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    toast.success("Signed out");
  }, []);

  const value = useMemo(
    () => ({
      user,
      token: getToken(),
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
