import { cn } from "@/lib/utils";

type PanelProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Control on the right of the title: a link, a toggle. */
  action?: React.ReactNode;
  /** The previous data stays visible, dimmed, while a new period or filter loads. */
  busy?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Shell shared by every dashboard widget, so titles, spacing and loading states read the same everywhere. */
export function Panel({ title, description, action, busy = false, className, children }: PanelProps) {
  return (
    <section
      aria-busy={busy || undefined}
      className={cn("flex flex-col rounded-3xl border border-border/70 bg-surface p-5 transition-opacity", busy && "opacity-60", className)}
    >
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight">{title}</h2>
          {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="mt-4 flex-1">{children}</div>
    </section>
  );
}
