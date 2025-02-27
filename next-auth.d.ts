import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      avatar: string;
      rola: string;
      
    } & DefaultSession["user"];
    accessToken?: string; // Dodajemy accessToken
  }

  interface Account {
    access_token?: string;
  }
}
