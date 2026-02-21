"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import { getRedirectPath } from "@/utils/authRedirect";

export default function AuthLayout({ children }: any) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!auth?.loading && auth?.user) {
      const path = getRedirectPath(auth.user);
      router.replace(path);
    }
  }, [auth?.user, auth?.loading]);

  if (auth?.loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 transition-all duration-300">
      {children}
    </div>
  );
}
