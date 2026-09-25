/** Value returned by every dashboard server action, so forms can show a clear message. */
export type ActionResult =
  | { ok: true; message?: string; redirectTo?: string }
  | { ok: false; error: string }
