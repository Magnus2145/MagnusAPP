import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Attempting login for:", credentials?.email)
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password")
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        console.log("User found:", !!user)

        if (!user || !user.password) {
          console.log("User not found or password not set")
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        console.log("Password valid:", isPasswordValid)

        if (!isPasswordValid) {
          return null
        }

        console.log("Login successful for:", user.email)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role
      }
      return session
    },
    async signIn({ user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (dbUser) {
          user.role = dbUser.role
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

