import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encryptSecret } from "@/lib/crypto";
import { z } from "zod";

const schema = z.object({
  apiKey: z.string().min(20).max(120),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json().catch(() => ({}));
  const { apiKey } = schema.parse(payload);
  const { enc, iv, authTag } = encryptSecret(apiKey);

  await prisma.openAIKey.upsert({
    where: { userId: session.user.id },
    update: { keyCipher: enc, iv, authTag },
    create: { userId: session.user.id, keyCipher: enc, iv, authTag },
  });

  return NextResponse.json({ ok: true });
}
