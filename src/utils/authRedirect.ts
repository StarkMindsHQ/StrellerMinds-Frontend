import { User } from "@/types/auth";

export const getRedirectPath = (user: User | null): string => {
  if (!user) return "/login";
  if (!user.role) return "/select-role";
  return "/dashboard";
};
