import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import type { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.accessToken = token.accessToken as string;

        // Pobranie danych użytkownika z Discord API
        const discordUser = await fetch("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${token.accessToken}` },
        }).then((res) => res.json());

        session.user.name = discordUser.username;
        session.user.avatar = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`;
        // Sprawdzenie czy użytkownik już istnieje
        const existingUser = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: session.user.id,
              nick: session.user.name ?? "default_nick",
              avatar: session.user.avatar,
              accessToken: token.accessToken as string,
              rola: "Gracz",
              currentWeek: new Date().toISOString().split("T")[0],
            },
          });
        }
        else{
          session.user.rola = existingUser.rola;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
