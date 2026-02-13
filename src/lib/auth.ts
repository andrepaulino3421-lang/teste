import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { rateLimit } from './security/rate-limit';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'Credenciais',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) return null;
        const ip = (req?.headers?.['x-forwarded-for'] as string) ?? 'local';
        if (!rateLimit(`login:${ip}:${credentials.email}`, 10, 60_000)) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: { subscription: true }
        });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        const sub = user.subscription ?? await prisma.subscription.create({
          data: { userId: user.id, plan: 'FREE', status: 'ACTIVE', provider: 'MANUAL' }
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
          plan: sub.plan
        } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.plan = (user as any).plan;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).plan = token.plan;
      }
      return session;
    }
  }
};
