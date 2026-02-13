import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { resetPasswordSchema } from '@/lib/validators/auth';

export async function POST(req: Request) {
  const payload = await req.json();
  const parsed = resetPasswordSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });

  const tokenHash = crypto.createHash('sha256').update(parsed.data.token).digest('hex');
  const reset = await prisma.passwordResetToken.findFirst({
    where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } }
  });
  if (!reset) return NextResponse.json({ error: 'Token inválido ou expirado.' }, { status: 400 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.$transaction([
    prisma.user.update({ where: { id: reset.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: reset.id }, data: { usedAt: new Date() } })
  ]);

  return NextResponse.json({ ok: true });
}
