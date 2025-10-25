import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireActiveSub } from "@/lib/billing";
import { comparePolicies } from "@/lib/ai";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const schema = z.object({
  organizationId: z.string().min(1),
  policyIds: z.array(z.string().min(1)).min(2),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => ({}));
  const parsedBody = schema.safeParse(json);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const body = parsedBody.data;

  const membership = await prisma.organizationMember.findFirst({
    where: { organizationId: body.organizationId, userId: session.user.id },
  });
  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const subscription = await requireActiveSub(body.organizationId);
  if (!subscription.ok) {
    return NextResponse.json({ error: "Subscription required" }, { status: 402 });
  }

  const policies = await prisma.policy.findMany({
    where: { id: { in: body.policyIds } },
  });
  if (policies.length !== body.policyIds.length) {
    return NextResponse.json({ error: "Policies not found" }, { status: 404 });
  }

  const resultJson = await comparePolicies({ userId: session.user.id, policies });

  let parsed: { diff?: Prisma.JsonValue; recommendation?: string } = {};
  try {
    parsed = JSON.parse(resultJson ?? "{}");
  } catch (error) {
    return NextResponse.json({ error: "Invalid AI response" }, { status: 502 });
  }

  if (!parsed?.diff || typeof parsed.recommendation !== "string") {
    return NextResponse.json({ error: "Incomplete AI response" }, { status: 502 });
  }

  const comparison = await prisma.comparison.create({
    data: {
      organizationId: body.organizationId,
      policyIds: body.policyIds,
      diffJson: parsed.diff,
      recommendation: parsed.recommendation,
      createdById: session.user.id,
    },
  });

  return NextResponse.json({
    id: comparison.id,
    diff: comparison.diffJson,
    recommendation: comparison.recommendation,
  });
}
