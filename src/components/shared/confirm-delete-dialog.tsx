"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ConfirmDeleteDialogProps = {
  triggerLabel: string;
  title: string;
  description: React.ReactNode;
  /** Text the user has to type to unlock the confirm button (site name, e-mail…). */
  expected: string;
  confirmLabel: string;
  /** Server Action: on success it redirects, so it only ever returns on failure. */
  onConfirm: (typed: string) => Promise<{ ok: false; message: string }>;
};

const normalize = (value: string) => value.trim().toLowerCase();

// Irreversible deletions always go through this dialog: an explicit alert plus a typed confirmation.
export function ConfirmDeleteDialog({ triggerLabel, title, description, expected, confirmLabel, onConfirm }: ConfirmDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const unlocked = normalize(value) === normalize(expected);

  function handleOpenChange(next: boolean) {
    if (pending) return;
    setOpen(next);
    if (!next) {
      setValue("");
      setError(undefined);
    }
  }

  function confirm() {
    setError(undefined);
    startTransition(async () => {
      const result = await onConfirm(value);
      setError(result.message);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            className="h-10 rounded-full border-[1.5px] border-destructive/50 bg-surface px-5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          />
        }
      >
        {triggerLabel}
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-5 rounded-3xl p-6 data-[size=default]:sm:max-w-md">
        <AlertDialogHeader className="place-items-start gap-3 text-left">
          <span aria-hidden className="grid size-11 place-items-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="size-5" />
          </span>
          <AlertDialogTitle className="font-heading text-xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-delete-input" className="text-sm">
            Pour confirmer, saisissez <strong className="font-semibold">{expected}</strong>
          </Label>
          <Input
            id="confirm-delete-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            disabled={pending}
            className="h-11 rounded-xl border-2 border-foreground/15 bg-surface px-3"
          />
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>

        <AlertDialogFooter className="mx-0 mb-0 flex-col-reverse gap-2 border-0 bg-transparent p-0 sm:flex-row sm:justify-end">
          <AlertDialogCancel disabled={pending} className="h-10 rounded-full px-5">
            Annuler
          </AlertDialogCancel>
          <Button
            type="button"
            disabled={!unlocked || pending}
            aria-busy={pending}
            onClick={confirm}
            className="h-10 rounded-full bg-destructive px-5 text-white hover:bg-destructive/85"
          >
            {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
