import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role?: string; // Add whatever fields your NestJS backend returns
    } & DefaultSession["user"];
  }
}