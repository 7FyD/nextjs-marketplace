import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

declare module "next-auth" {
  interface Session {
    user: {
      username: string | null;
      role: "ADMIN" | "USER";
      emailVerified: true | false;
      isTwoFactorEnabled: true | false;
      favoriteIds: string[];
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          username: user.name,
          publicEmail: user.email,
          isOAuth: true,
        },
      });
    },
    async createUser({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          publicEmail: user.email,
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);
      if (!existingUser) return false;
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }
      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role === "USER" ? "USER" : "ADMIN";
      }
      session.user.emailVerified = token.emailVerified === true ? true : false;
      session.user.isTwoFactorEnabled =
        token.isTwoFactorEnabled === true ? true : false;
      session.user.favoriteIds = token.favoriteIds as string[];
      session.user.name = token.name;
      session.user.image = token.picture;
      session.user.username = token.username as string;
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;
      token.name = existingUser.name;
      token.picture = existingUser.image;
      token.emailVerified = existingUser.emailVerified && 1 == 1;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.favoriteIds = existingUser.favoriteIds;
      token.username = existingUser.username;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
