export type FormState<Field extends string> = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<Field, string[]>>;
  /** Values sent back so the form is not cleared after an error (never passwords). */
  values?: Partial<Record<Field, string>>;
};
