import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

const baseAdapter = PrismaAdapter(prisma)
const customAdapter = {
  ...baseAdapter,
  getUserByAccount: async (provider_providerAccountId: { provider: string; providerAccountId: string }) => {
    const account = await prisma.account.findUnique({
      where: { provider_providerAccountId }
    })
    if (!account) return null
    const user = await prisma.user.findUnique({
      where: { id: account.userId }
    })
    return (user as any) || null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: customAdapter,
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        (session.user as any).isPremium = token.isPremium ?? false;
        (session.user as any).planType = token.planType ?? '';
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.sub = String(user.id);
        token.isPremium = (user as any).isPremium ?? false;
        token.planType = (user as any).planType ?? '';
      }
      // On session update or token refresh, re-fetch from DB
      if (trigger === 'update' || (!token.planType && token.sub)) {
        try {
          const dbUser = await prisma.user.findUnique({ where: { id: parseInt(token.sub!) } });
          if (dbUser) {
            token.isPremium = dbUser.isPremium ?? false;
            token.planType = dbUser.planType ?? '';
          }
        } catch {
          // Silently continue if DB fetch fails
        }
      }
      return token;
    }
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        
        if (!user || !user.password) {
          return null
        }
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        
        if (!isPasswordValid) {
          return null
        }
        
        return { ...user, id: String(user.id) }
      }
    })
  ]
})
