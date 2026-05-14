import { randomUUID } from "crypto";

/** 8-char URL-safe token (hex from UUID prefix). */
export function generateSlug(): string {
  return randomUUID().replace(/-/g, "").slice(0, 8);
}
