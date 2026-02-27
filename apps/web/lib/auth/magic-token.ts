/** DB 없이 HMAC-SHA256으로 서명하는 매직링크 토큰 유틸리티 */
import { createHmac } from "crypto";

const EXPIRE_MS = 24 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.NEXTAUTH_SECRET ?? "dev-secret-do-not-use-in-production";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createMagicToken(email: string): string {
  const expires = Date.now() + EXPIRE_MS;
  const payload = JSON.stringify({ email, expires });
  const sig = sign(payload);
  return Buffer.from(JSON.stringify({ payload, sig })).toString("base64url");
}

export function verifyMagicToken(token: string): string | null {
  try {
    const parsed = JSON.parse(Buffer.from(token, "base64url").toString());
    const { payload, sig } = parsed as { payload: string; sig: string };
    if (sign(payload) !== sig) return null;
    const { email, expires } = JSON.parse(payload) as { email: string; expires: number };
    if (expires < Date.now()) return null;
    return email;
  } catch {
    return null;
  }
}
