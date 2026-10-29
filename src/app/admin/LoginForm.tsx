"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action}>
      <p className="font-display text-[18px] font-extrabold uppercase tracking-[-0.02em]">Express Wash</p>
      <h1 className="mt-6 text-[22px] font-medium">Pickups</h1>
      <p className="mt-1 text-[var(--a-muted)]">Staff only. Enter the admin password.</p>
      <label htmlFor="password" className="mt-6 block font-medium">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="a-input mt-2 w-full"
        aria-invalid={state?.error ? true : undefined}
        aria-describedby={state?.error ? "pw-error" : undefined}
      />
      {state?.error && (
        <p id="pw-error" className="mt-2 text-[#b3261e]">
          {state.error}
        </p>
      )}
      <button type="submit" className="a-btn mt-4 w-full" disabled={pending}>
        {pending ? "Checking…" : "Open pickups"}
      </button>
    </form>
  );
}
