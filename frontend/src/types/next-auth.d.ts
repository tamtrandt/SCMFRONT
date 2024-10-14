/* eslint-disable @typescript-eslint/no-unused-vars */
// types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

// Mở rộng kiểu User
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      accessToken: string;
      emailVerified:Date | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    emailVerified:Date | null;
  }
  interface CustomToken extends JWT {
  accessToken: string;
  emailVerified: Date | null; 
}
}


// Mở rộng kiểu JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string; 
  }
}
