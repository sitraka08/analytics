"use client";

import { AnimatePresence, m } from "motion/react";
import { CircleAlert, CircleCheck } from "lucide-react";

type FormMessageProps = {
  message?: string;
  tone?: "error" | "success";
};

export function FormMessage({ message, tone = "error" }: FormMessageProps) {
  const Icon = tone === "error" ? CircleAlert : CircleCheck;

  return (
    <AnimatePresence initial={false}>
      {message ? (
        <m.div
          key={message}
          role={tone === "error" ? "alert" : "status"}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <p
            className={`flex items-start gap-2 rounded-2xl px-4 py-3 text-sm ${
              tone === "error"
                ? "bg-destructive/10 text-destructive"
                : "bg-brand-green/25 text-foreground"
            }`}
          >
            <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
            {message}
          </p>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
