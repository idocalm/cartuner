"use client";

import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(null);

  /*
  const onSocketConnected = () => {
    console.error("Socket connected");
    setSocketConnected(true);
    setSocketId(socket.id);
    setSocketTransport(socket.io.engine.transport.name);

    socket.on("newAlert", (alertData) => {
      console.log("New alert:", alertData);
    });

    socket.io.engine.on("upgrade", (transport: Transport) => {
      setSocketTransport(transport.name);
    });
  };

  const onSocketDisconnected = () => {
    console.error("Socket disconnected");
    setSocketConnected(false);
    setSocketId(undefined);
    setSocketTransport(null);
  };

  emitter.on("initSocket", () => {
    socket.connect();
  });

  socket.on("connect", onSocketConnected);
  socket.on("disconnect", onSocketDisconnected);
*/
  useEffect(() => {
    const savedToken = Cookies.get("auth-token");
    if (savedToken) {
      setTokenState(savedToken);
    }

    /*

    return () => {
      socket.off("connect", onSocketConnected);
      socket.off("disconnect", onSocketDisconnected);
    };

    */
  }, []);

  /* TODO: Why is this here? If we're setting the token in the cookie, why do we need to set it in local storage? */
  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("authToken", newToken);
    } else {
      localStorage.removeItem("authToken");
    }
    setTokenState(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, setToken }}>
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
