import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'USER' | 'ADMIN';
      plan?: 'FREE' | 'PRO';
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'USER' | 'ADMIN';
    plan?: 'FREE' | 'PRO';
  }
}
