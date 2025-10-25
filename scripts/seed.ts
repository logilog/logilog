import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "founder@example.com" },
    update: {},
    create: {
      email: "founder@example.com",
      name: "Founder",
      passwordHash,
    },
  });

  const organization = await prisma.organization.upsert({
    where: { slug: "founder-co" },
    update: {},
    create: {
      name: "Founder Co",
      slug: "founder-co",
    },
  });

  await prisma.organizationMember.upsert({
    where: { userId_organizationId: { userId: user.id, organizationId: organization.id } },
    update: { role: "OWNER" },
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: "OWNER",
    },
  });

  await prisma.subscription.upsert({
    where: { stripeCustomerId: "fake_customer" },
    update: { status: "active" },
    create: {
      organizationId: organization.id,
      stripeCustomerId: "fake_customer",
      status: "trialing",
    },
  });

  console.log("Seeded initial user and organization");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
