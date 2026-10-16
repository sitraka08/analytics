import { CircleAlert } from "lucide-react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type TextFieldProps = Omit<React.ComponentProps<typeof Input>, "id"> & {
  name: string;
  label: string;
  description?: string;
  errors?: string[];
  labelAction?: React.ReactNode;
  /** Élément placé à droite dans le champ (ex. bouton afficher le mot de passe). */
  trailing?: React.ReactNode;
};

// Champ « rempli » : le libellé vit dans la boîte, comme sur un formulaire papier, et toute la boîte réagit au focus.
export function TextField({ name, label, description, errors, labelAction, trailing, className, ...inputProps }: TextFieldProps) {
  const id = `field-${name}`;
  const invalid = Boolean(errors?.length);

  return (
    <Field className="gap-1.5" data-invalid={invalid || undefined}>
      <div
        className={`relative flex items-center rounded-2xl border-2 bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-colors ${
          invalid ? "border-destructive" : "border-foreground/15 hover:border-foreground/35 focus-within:border-foreground focus-within:hover:border-foreground"
        }`}
      >
        <div className="flex min-w-0 flex-1 flex-col px-4 pb-2 pt-2.5">
          <FieldLabel htmlFor={id} className={`text-xs font-medium ${invalid ? "text-destructive" : "text-muted-foreground"}`}>
            {label}
          </FieldLabel>
          <Input
            id={id}
            name={name}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? `${id}-error` : description ? `${id}-description` : undefined}
            className={`h-7 rounded-none border-0 bg-transparent p-0 text-base text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0 aria-invalid:ring-0 md:text-base dark:bg-transparent ${className ?? ""}`}
            {...inputProps}
          />
        </div>
        {trailing ? <div className="pr-2">{trailing}</div> : null}
      </div>
      {description && !invalid ? (
        <FieldDescription id={`${id}-description`} className="px-1">
          {description}
        </FieldDescription>
      ) : null}
      {invalid ? (
        <FieldError id={`${id}-error`} className="flex items-start gap-1.5 px-1">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>{[...new Set(errors)].join(" ")}</span>
        </FieldError>
      ) : null}
      {labelAction ? <div className="flex justify-end px-1">{labelAction}</div> : null}
    </Field>
  );
}
