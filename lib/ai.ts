import OpenAI from "openai";
import { decryptSecret } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";

export async function getClientForUser(userId: string) {
  const record = await prisma.openAIKey.findUnique({ where: { userId } });
  let apiKey = process.env.OPENAI_API_KEY;

  if (record) {
    apiKey = decryptSecret(Buffer.from(record.keyCipher), Buffer.from(record.iv), Buffer.from(record.authTag));
  }

  if (!apiKey) {
    throw new Error("No OpenAI API key configured");
  }

  return new OpenAI({ apiKey });
}

export async function extractCoverages({ userId, text }: { userId: string; text: string }) {
  const client = await getClientForUser(userId);
  const system =
    "You are an insurance policy parser. Extract coverages, limits, exclusions and normalize to a JSON schema with fields: coverages[], exclusions[], limits{}, notes.";
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: system },
      { role: "user", content: text },
    ],
  });
  const output = response.output_text;
  return JSON.parse(output);
}

export async function comparePolicies({
  userId,
  policies,
}: {
  userId: string;
  policies: any[];
}) {
  const client = await getClientForUser(userId);
  const system =
    "You compare normalized insurance policies and produce a diff JSON highlighting better/worse coverages, missing items and a plain-language recommendation.";
  const response = await client.responses.create({
    model: "gpt-4.1",
    input: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(policies) },
    ],
  });
  return response.output_text;
}
