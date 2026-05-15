export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-white ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
