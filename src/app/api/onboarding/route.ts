import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getApiUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

const schema = z.object({ channel: z.enum(['STORE', 'MARKETPLACE', 'RESTAURANT']) });

export async function POST(req: Request) {
  const user = await getApiUser();
  if (!user?.id) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Canal inválido.' }, { status: 400 });

  await prisma.user.update({ where: { id: user.id }, data: { defaultChannel: parsed.data.channel } });
  return NextResponse.json({ ok: true });
}
