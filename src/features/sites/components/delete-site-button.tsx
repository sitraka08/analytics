"use client";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { deleteSiteAction } from "../services/delete-site";

type DeleteSiteButtonProps = { siteId: string; name: string; domain: string };

export function DeleteSiteButton({ siteId, name, domain }: DeleteSiteButtonProps) {
  return (
    <ConfirmDeleteDialog
      triggerLabel="Supprimer le site"
      title="Supprimer ce site ?"
      description={
        <>
          Toutes les statistiques de <strong className="font-medium text-foreground">{domain}</strong> seront supprimées définitivement et
          le script installé sur votre site cessera de fonctionner. Cette action est irréversible.
        </>
      }
      expected={name}
      confirmLabel="Supprimer définitivement"
      onConfirm={(typed) => deleteSiteAction(siteId, typed)}
    />
  );
}
