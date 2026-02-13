import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSubscription, getApiUser } from '@/lib/session';
import { presetSchema } from '@/lib/validators/app';

export async function GET() {
  const user = await getApiUser();
  if (!user?.id) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const presets = await prisma.preset.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(presets);
}

export async function POST(req: Request) {
  const user = await getApiUser();
  if (!user?.id) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const parsed = presetSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const subscription = await getUserSubscription(user.id);
  if (subscription.plan === 'FREE') {
    const countInChannel = await prisma.preset.count({ where: { userId: user.id, channel: parsed.data.channel } });
    if (countInChannel >= 1) {
      return NextResponse.json({ error: 'No FREE, apenas 1 preset por canal.' }, { status: 403 });
    }
  }

  if (parsed.data.isDefault) {
    await prisma.preset.updateMany({ where: { userId: user.id, channel: parsed.data.channel }, data: { isDefault: false } });
  }

  const created = await prisma.preset.create({
    data: {
      userId: user.id,
      channel: parsed.data.channel,
      name: parsed.data.name,
      configJson: parsed.data.config,
      isDefault: parsed.data.isDefault
    }
  });

  return NextResponse.json(created);
}
