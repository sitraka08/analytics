import { ROUTES } from "@/lib/routes";
import { HERO } from "../constants/content";

export function SignupForm({ className = "" }: { className?: string }) {
  return (
    <form
      action={ROUTES.register}
      method="get"
      className={`mx-auto flex w-full max-w-md items-center gap-2 rounded-full bg-surface p-1.5 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.25)] ${className}`}
    >
      <label htmlFor="signup-email" className="sr-only">
        {HERO.emailLabel}
      </label>
      <input
        id="signup-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder={HERO.emailPlaceholder}
        className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center gap-3 rounded-full bg-foreground py-1.5 pl-5 pr-1.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
      >
        {HERO.cta}
        <span
          aria-hidden
          className="grid size-8 place-items-center rounded-full bg-background text-foreground"
        >
          →
        </span>
      </button>
    </form>
  );
}
