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
      className={`glass-morphism premium-shadow rounded-2xl p-6 transition-all duration-300 hover:border-white/20 ${className}`}
    >
      {children}
    </div>
  );
}
