import { HandDrawnUnderline } from "@/components/shared/hand-drawn-underline";

type AuthPanelProps = {
  title: string;
  /** Partie du titre soulignée à la main ; doit apparaître telle quelle dans `title`. */
  highlight?: string;
  description?: React.ReactNode;
  children: React.ReactNode;
};

function Title({ title, highlight }: Pick<AuthPanelProps, "title" | "highlight">) {
  const index = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || index === -1) return title;

  return (
    <>
      {title.slice(0, index)}
      <span className="relative inline-block">
        {highlight}
        <HandDrawnUnderline className="-bottom-1.5 h-2.5 w-[104%] text-brand-orange" />
      </span>
      {title.slice(index + highlight.length)}
    </>
  );
}

export function AuthPanel({ title, highlight, description, children }: AuthPanelProps) {
  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          <Title title={title} highlight={highlight} />
        </h1>
        {description ? <p className="text-pretty text-base leading-relaxed text-muted-foreground">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}
