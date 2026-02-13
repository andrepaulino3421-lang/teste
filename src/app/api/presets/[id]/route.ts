import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiUser } from '@/lib/session';
import { presetSchema } from '@/lib/validators/app';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getApiUser();
  if (!user?.id) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const parsed = presetSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const existing = await prisma.preset.findFirst({ where: { id: params.id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: 'Preset não encontrado.' }, { status: 404 });

  if (parsed.data.isDefault) {
    await prisma.preset.updateMany({ where: { userId: user.id, channel: parsed.data.channel }, data: { isDefault: false } });
  }

  const updated = await prisma.preset.update({
    where: { id: params.id },
    data: { channel: parsed.data.channel, name: parsed.data.name, configJson: parsed.data.config, isDefault: parsed.data.isDefault }
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const user = await getApiUser();
  if (!user?.id) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  await prisma.preset.deleteMany({ where: { id: params.id, userId: user.id } });
  return NextResponse.json({ ok: true });
}
