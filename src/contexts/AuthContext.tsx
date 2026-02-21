"use client";

import { createContext, useEffect, useState } from "react";
import { User } from "@/types/auth";
import * as AuthService from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  setRole: (role: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await AuthService.loginUser(email, password);
    setUser(res);
    localStorage.setItem("auth_user", JSON.stringify(res));
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    const res = await AuthService.registerUser(
      fullName,
      email,
      password
    );
    setUser(res);
    localStorage.setItem("auth_user", JSON.stringify(res));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  const setRole = (role: string) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem("auth_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
