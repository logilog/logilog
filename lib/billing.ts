import { prisma } from "@/lib/prisma";

export async function requireActiveSub(organizationId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { organizationId },
  });

  if (!subscription) {
    return { ok: false, reason: "no-subscription" } as const;
  }

  if (subscription.status === "active" || subscription.status === "trialing") {
    return { ok: true } as const;
  }

  if (subscription.currentPeriodEnd && subscription.currentPeriodEnd > new Date()) {
    return { ok: true } as const;
  }

  return { ok: false, reason: "inactive" } as const;
}
