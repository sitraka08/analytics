"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = React.ComponentProps<typeof Button>;

// Pilule sombre avec pastille fléchée, comme le CTA de la landing. La variante contour reste sans flèche.
export function SubmitButton({ children, className, variant = "default", ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const primary = variant === "default";

  return (
    <Button
      type="submit"
      size="lg"
      variant={variant}
      disabled={pending}
      aria-busy={pending}
      className={`h-12 gap-3 rounded-full text-base font-medium ${
        primary ? "justify-between pl-6 pr-1.5 hover:bg-primary/85" : "border-[1.5px] border-input bg-surface px-5 hover:bg-cream-deep"
      } ${className ?? ""}`}
      {...props}
    >
      {!primary && pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
      {children}
      {primary ? (
        <span aria-hidden className="grid size-9 place-items-center rounded-full bg-background text-foreground">
          {pending ? <Loader2 className="animate-spin" /> : <ArrowRight />}
        </span>
      ) : null}
    </Button>
  );
}
