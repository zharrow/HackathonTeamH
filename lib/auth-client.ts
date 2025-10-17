"use client";

import { createAuthClient } from "better-auth/react";

// Get the base URL - use window.location.origin in browser, fallback to env variable
const getBaseURL = () => {
  // In browser, use the current origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // On server or build time, use env variable
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signUp, signOut, useSession, $Infer } = authClient;
