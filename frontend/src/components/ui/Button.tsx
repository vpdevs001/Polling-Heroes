import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "outline" | "link";
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-white text-black shadow-lg shadow-white/5 hover:bg-zinc-200 premium-shadow",
    danger:
      "bg-rose-600/90 text-white hover:bg-rose-600 shadow-lg shadow-rose-900/20",
    ghost: "bg-white/5 text-zinc-200 ring-1 ring-white/10 hover:bg-white/10",
    outline:
      "bg-transparent text-white border border-white/20 hover:bg-white/5 hover:border-white/30",
    link: "bg-transparent p-0 text-white hover:underline h-auto",
  };

  const styles = variants[variant];
  return (
    <button
      type={type}
      className={`${base} ${styles} ${className}`}
      {...props}
    />
  );
}
