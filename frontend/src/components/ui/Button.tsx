import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  children: ReactNode;
};

export function Button({ variant = "primary", className = "", type = "button", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:brightness-110"
      : variant === "danger"
        ? "bg-rose-600/90 text-white hover:bg-rose-600"
        : "bg-white/5 text-slate-200 ring-1 ring-white/10 hover:bg-white/10";
  return <button type={type} className={`${base} ${styles} ${className}`} {...props} />;
}
