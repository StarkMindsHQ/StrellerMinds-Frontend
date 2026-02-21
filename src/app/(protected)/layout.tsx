"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import { getRedirectPath } from "@/utils/authRedirect";

export default function ProtectedLayout({ children }: any) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!auth?.loading) {
      const path = getRedirectPath(auth?.user ?? null);

      if (path !== "/dashboard") {
        router.replace(path);
      }
    }
  }, [auth?.user, auth?.loading]);

  if (auth?.loading || !auth?.user || !auth.user.role) {
    return null;
  }

  return (
    <div className="min-h-screen transition-all duration-300">
      {children}
    </div>
  );
}
