"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  name: string | null;
  email: string;
  setToken: (token: string | null) => void;
  setName: (name: string | null) => void;
  setEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const savedToken = Cookies.get("auth-token");
    if (savedToken) {
      setTokenState(savedToken);
    }
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("authToken", newToken);
    } else {
      localStorage.removeItem("authToken");
    }
    setTokenState(newToken);
  };

  return (
    <AuthContext.Provider
      value={{ token, name, email, setToken, setEmail, setName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
