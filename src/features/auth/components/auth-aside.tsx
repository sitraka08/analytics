import { DeskScene } from "@/components/shared/illustrations/desk-scene";
import { toneClass, type Tone } from "@/lib/tones";

const TILES: { value: string; label: string; tone: Tone; className: string }[] = [
  { value: "128", label: "visiteurs en ce moment", tone: "blue", className: "rounded-3xl" },
  { value: "+12 %", label: "vs la semaine dernière", tone: "green", className: "rounded-[2.5rem_1.5rem_2.5rem_1.5rem]" },
  { value: "0", label: "cookie déposé", tone: "violet", className: "rounded-[1.5rem_2.5rem_1.5rem_2.5rem]" },
  { value: "< 2 Ko", label: "de script à installer", tone: "orange", className: "rounded-3xl" },
];

export function AuthAside() {
  return (
    <aside className="relative hidden flex-col justify-between gap-8 overflow-hidden rounded-4xl bg-cream-deep p-10 lg:flex xl:p-14">
      <div className="flex flex-col gap-4">
        <p className="max-w-md text-balance font-heading text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
          Vos visiteurs, <span className="bg-highlight px-2">sans cookie</span> ni jargon.
        </p>
        <p className="max-w-sm text-base leading-relaxed text-muted-foreground">Pays, pages, sources et appareils réunis sur un écran que tout le monde comprend.</p>
      </div>

      <DeskScene className="mx-auto w-full max-w-md" />

      <ul aria-hidden className="grid grid-cols-2 gap-3">
        {TILES.map((tile) => (
          <li key={tile.label} className={`flex flex-col gap-0.5 px-5 py-4 ${toneClass(tile.tone)} ${tile.className}`}>
            <span className="font-heading text-2xl font-bold tracking-tight xl:text-3xl">{tile.value}</span>
            <span className="text-sm font-medium">{tile.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
