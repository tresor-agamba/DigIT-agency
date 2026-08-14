import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { phoneSchema } from "@/lib/validation/phone";

const credentialsSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Téléphone et mot de passe",
      credentials: { phone: { label: "Numéro de téléphone", type: "tel" }, password: { label: "Mot de passe", type: "password" } },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({ where: { phone: parsed.data.phone } });
        if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return null;

        return { id: user.id, name: user.name, phone: user.phone, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.phone = user.phone; token.role = user.role; }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id && token.phone && token.role) {
        session.user.id = token.id;
        session.user.phone = token.phone;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
