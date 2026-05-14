import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-xl shadow-black/30 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
