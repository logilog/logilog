import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

function getKey() {
  const base64Key = process.env.ENCRYPTION_KEY_BASE64;
  if (!base64Key) {
    throw new Error("ENCRYPTION_KEY_BASE64 is not set");
  }
  return Buffer.from(base64Key, "base64");
}

export function encryptSecret(plain: string) {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { enc, iv, authTag };
}

export function decryptSecret(enc: Buffer, iv: Buffer, authTag: Buffer) {
  const key = getKey();
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString("utf8");
}
