import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className = "", ...props }: Props) {
  const inputId = id ?? props.name;
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="text-zinc-300">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2 text-zinc-100 placeholder:text-zinc-500 shadow-inner shadow-black/20 outline-none ring-0 transition focus:border-white/40 focus:ring-2 focus:ring-white/10 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
