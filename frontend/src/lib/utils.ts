import { format, formatDistanceToNow } from "date-fns";

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "MMM d, yyyy h:mm a");
  } catch {
    return "—";
  }
}

export function formatRelative(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "—";
  }
}

const sessionKey = (slug: string) => `poll_session_${slug}`;

export function getSessionToken(slug: string) {
  const existing = localStorage.getItem(sessionKey(slug));
  if (existing) return existing;
  const token = crypto.randomUUID();
  localStorage.setItem(sessionKey(slug), token);
  return token;
}

export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export function statusBadgeClass(status: string) {
  if (status === "Active")
    return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30";
  if (status === "Ended")
    return "bg-rose-500/15 text-rose-300 ring-rose-500/30";
  return "bg-zinc-500/15 text-zinc-300 ring-zinc-500/30";
}

export function publicPollUrl(slug: string) {
  return `${window.location.origin}/poll/${slug}`;
}
