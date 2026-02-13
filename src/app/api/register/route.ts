import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validators/auth';
import { rateLimit } from '@/lib/security/rate-limit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  if (!rateLimit(`register:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em instantes.' }, { status: 429 });
  }

  const payload = await req.json();
  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        passwordHash,
        subscription: { create: { plan: 'FREE', status: 'ACTIVE', provider: 'MANUAL' } }
      }
    });

    return NextResponse.json({ id: user.id });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Email já cadastrado.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erro interno no cadastro.' }, { status: 500 });
  }
}
