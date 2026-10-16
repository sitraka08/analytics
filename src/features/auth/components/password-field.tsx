"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { TextField } from "@/components/shared/text-field";

type PasswordFieldProps = Omit<React.ComponentProps<typeof TextField>, "type" | "trailing">;

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={visible}
          className="grid size-9 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-line hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground"
        >
          <Icon aria-hidden className="size-4.5" />
        </button>
      }
    />
  );
}
