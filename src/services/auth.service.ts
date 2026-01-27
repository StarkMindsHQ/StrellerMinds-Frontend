import { signIn, signOut } from "next-auth/react";

export const authService = {
  loginWithProvider(provider: "google" | "github") {
    return signIn(provider);
  },

  logout() {
    return signOut({ callbackUrl: "/" });
  },
};
