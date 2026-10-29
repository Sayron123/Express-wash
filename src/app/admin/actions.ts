"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { ADMIN_COOKIE, ADMIN_MAX_AGE, adminToken, isAdmin, passwordMatches } from "@/lib/admin-auth";
import { isStatus } from "@/lib/shop";
import { memoryStoreOn, memoryUpdate } from "@/lib/memory-store";
import { serviceClient } from "@/lib/supabase";

export async function login(_prev: { error?: string } | null, fd: FormData): Promise<{ error?: string }> {
  const password = String(fd.get("password") ?? "");
  const token = adminToken();
  if (!token) return { error: "ADMIN_PASSWORD is not set on the server." };
  if (!passwordMatches(password)) return { error: "That password is not right." };

  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  });
  refresh();
  return {};
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  refresh();
}

export async function updateStatus(id: string, status: string): Promise<{ ok: boolean; error?: string }> {
  // Server actions are public endpoints: check the gate on every call.
  if (!(await isAdmin())) return { ok: false, error: "Signed out. Enter the password again." };
  if (!isStatus(status) || !/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, error: "That change isn't valid." };

  if (memoryStoreOn()) {
    memoryUpdate(id, status);
    return { ok: true };
  }
  const { error } = await serviceClient().from("pickups").update({ status }).eq("id", id);
  if (error) {
    console.error("updateStatus failed", error);
    return { ok: false, error: "Couldn't save the status. Try again." };
  }
  return { ok: true };
}
