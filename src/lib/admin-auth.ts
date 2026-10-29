import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// A simple password gate: the cookie holds an HMAC of a fixed label keyed by ADMIN_PASSWORD,
// so it cannot be forged without the password and changing the password logs everyone out.

export const ADMIN_COOKIE = "ew_admin";
export const ADMIN_MAX_AGE = 60 * 60 * 12; // 12 hours

function adminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.length >= 8 ? pw : null;
}

export function adminToken(): string | null {
  const pw = adminPassword();
  return pw ? createHmac("sha256", pw).update("express-wash-admin-v1").digest("hex") : null;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function passwordMatches(input: string): boolean {
  const pw = adminPassword();
  return pw !== null && safeEqual(input, pw);
}

export const adminConfigured = () => adminPassword() !== null;

export async function isAdmin(): Promise<boolean> {
  const token = adminToken();
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return token !== null && value !== undefined && safeEqual(value, token);
}
