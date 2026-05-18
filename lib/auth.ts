import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: true,
  logger: {
    error(error) {
      console.error("[AUTH ERROR]", error.name, error.message)
      if (error.cause) console.error("[AUTH CAUSE]", error.cause)
      if (error.stack) console.error("[AUTH STACK]", error.stack)
    },
    warn(code) {
      console.warn("[AUTH WARN]", code)
    },
    debug(message, metadata) {
      console.log("[AUTH DEBUG]", message, metadata)
    },
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request repo access so we can read PRs
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})
