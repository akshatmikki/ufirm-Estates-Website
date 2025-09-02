"use client";
import React, { createContext, useContext, useState } from "react";

const LoginDialogContext = createContext({
  showLogin: false,
  openLogin: () => {},
  closeLogin: () => {},
});

export function useLoginDialog() {
  return useContext(LoginDialogContext);
}

export function LoginDialogProvider({ children }: { children: React.ReactNode }) {
  const [showLogin, setShowLogin] = useState(false);
  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  return (
    <LoginDialogContext.Provider value={{ showLogin, openLogin, closeLogin }}>
      {children}
    </LoginDialogContext.Provider>
  );
}
