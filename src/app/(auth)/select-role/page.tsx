"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";

const roles = ["student", "mentor", "admin"];

export default function SelectRolePage() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!auth?.loading) {
      if (!auth?.user) {
        router.replace("/login");
      }

      if (auth?.user?.role) {
        router.replace("/dashboard");
      }
    }
  }, [auth?.user, auth?.loading]);

  if (!auth?.user || auth.user.role) return null;

  const handleSelect = (role: string) => {
    auth?.setRole(role);
    router.replace("/dashboard");
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
      <h1 className="text-xl font-semibold mb-6">Select Your Role</h1>

      <div className="space-y-4">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleSelect(role)}
            className="w-full border rounded-xl py-3 hover:bg-black hover:text-white transition-all"
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
