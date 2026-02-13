import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { forgotPasswordSchema } from '@/lib/validators/auth';
import { sendResetEmail } from '@/lib/email';

export async function POST(req: Request) {
  const payload = await req.json();
  const parsed = forgotPasswordSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt }
  });

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const link = `${baseUrl}/reset-password?token=${token}`;
  const sent = await sendResetEmail(user.email, link);

  return NextResponse.json({ ok: true, devResetLink: sent || process.env.NODE_ENV === 'production' ? undefined : link });
}
