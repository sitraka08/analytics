"use client";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { deleteAccountAction } from "../services/delete-account";

export function DeleteAccountButton({ email }: { email: string }) {
  return (
    <ConfirmDeleteDialog
      triggerLabel="Supprimer mon compte"
      title="Supprimer votre compte ?"
      description="Votre compte, tous vos sites et toutes leurs statistiques seront supprimés définitivement. Cette action est irréversible."
      expected={email}
      confirmLabel="Supprimer définitivement"
      onConfirm={(typed) => deleteAccountAction(typed)}
    />
  );
}
