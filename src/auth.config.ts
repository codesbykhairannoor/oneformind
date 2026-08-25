import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  secret: process.env.AUTH_SECRET || "ea22ef5cde1e1d9932eb2d6cca05e0950986dcd0322a246d2bfc19ce2c9a6618",
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login',
  },
  providers: [], // Providers are added in auth.ts to avoid Edge Runtime issues
} satisfies NextAuthConfig
