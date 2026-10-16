export type FormState<Field extends string> = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<Field, string[]>>;
  /** Valeurs renvoyées pour ne pas vider le formulaire après une erreur (jamais les mots de passe). */
  values?: Partial<Record<Field, string>>;
};
