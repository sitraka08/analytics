// Skeleton shown while URL params are read (same shape as the forms).
export function AuthFormFallback({ fields = 2 }: { fields?: number }) {
  return (
    <div aria-hidden className="flex animate-pulse flex-col gap-5">
      {Array.from({ length: fields }, (_, i) => (
        <div
          key={i}
          className="h-15 rounded-2xl border-2 border-foreground/10 bg-surface"
        />
      ))}
      <div className="h-12 rounded-full bg-cream-deep" />
    </div>
  );
}
