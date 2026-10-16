"use client";

import { useActionState } from "react";
import { FieldGroup } from "@/components/ui/field";
import { FormMessage } from "@/components/shared/form-message";
import { SubmitButton } from "@/components/shared/submit-button";
import { TextField } from "@/components/shared/text-field";
import type { FormState } from "@/lib/form-state";
import type { CreateSiteField } from "../schemas/site";
import { createSiteAction } from "../services/create-site";

const INITIAL_STATE: FormState<CreateSiteField> = { ok: false };

export function CreateSiteForm() {
  const [state, formAction] = useActionState(createSiteAction, INITIAL_STATE);

  return (
    <form action={formAction} noValidate className="w-full max-w-sm">
      <FieldGroup className="gap-5">
        <FormMessage message={state.message} />
        <TextField
          name="name"
          label="Nom du site"
          placeholder="Mon blog"
          autoComplete="off"
          required
          defaultValue={state.values?.name}
          errors={state.fieldErrors?.name}
        />
        <TextField
          name="domain"
          label="Domaine"
          placeholder="exemple.fr"
          description="Sans « https:// » ni chemin. Seul ce domaine pourra envoyer des visites."
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          required
          defaultValue={state.values?.domain}
          errors={state.fieldErrors?.domain}
        />
        <SubmitButton>Créer le site</SubmitButton>
      </FieldGroup>
    </form>
  );
}
