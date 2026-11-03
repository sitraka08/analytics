import { HandDrawnUnderline } from "@/components/shared/hand-drawn-underline";
import { PUBLISHER } from "../constants/publisher";
import type { LegalDocument } from "../types/legal";

function Title({
  title,
  highlight,
}: Pick<LegalDocument, "title" | "highlight">) {
  const index = title.indexOf(highlight);
  if (index === -1) return title;

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

export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 pt-28 pb-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          <Title title={document.title} highlight={document.highlight} />
        </h1>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground">
          {document.description}
        </p>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : {PUBLISHER.lastUpdated}
        </p>
      </header>

      <div className="mt-10 space-y-8">
        {document.sections.map((section, index) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-xl font-bold tracking-tight">
              {index + 1}. {section.title}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/85">
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.items ? (
                <ul className="list-disc space-y-1.5 pl-5 marker:text-brand-orange">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.closing?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
