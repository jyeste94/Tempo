"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Para simplificar el uso sin configuración de Firebase:
    // Autenticamos automáticamente al usuario usando una sesión falsa en el navegador.
    const storedUser = localStorage.getItem("daily_flow_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    const mockUser = { uid: "local-google-123", email: "usuario@google.com" };
    localStorage.setItem("daily_flow_user", JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const loginWithEmail = async (email, password) => {
    const mockUser = { uid: "local-email-123", email };
    localStorage.setItem("daily_flow_user", JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const registerWithEmail = async (email, password) => {
    const mockUser = { uid: "local-email-123", email };
    localStorage.setItem("daily_flow_user", JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = async () => {
    localStorage.removeItem("daily_flow_user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
