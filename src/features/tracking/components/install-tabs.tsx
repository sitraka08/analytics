"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { DEFAULT_GUIDE_ID, INSTALL_GUIDES } from "../constants/install-guides";
import { CopyButton } from "./copy-button";

type InstallTabsProps = {
  scriptUrl: string;
  publicKey: string;
  initialGuideId?: string;
};

export function InstallTabs({
  scriptUrl,
  publicKey,
  initialGuideId = DEFAULT_GUIDE_ID,
}: InstallTabsProps) {
  const [activeId, setActiveId] = useState(initialGuideId);
  const guide =
    INSTALL_GUIDES.find((item) => item.id === activeId) ?? INSTALL_GUIDES[0];
  const code = guide.code(scriptUrl, publicKey);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Votre stack"
        className="flex flex-wrap gap-2"
      >
        {INSTALL_GUIDES.map((item) => {
          const active = item.id === guide.id;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`stack-${item.id}`}
              aria-selected={active}
              aria-controls="stack-panel"
              onClick={() => setActiveId(item.id)}
              className={cn(
                "inline-flex h-9 items-center rounded-full border-[1.5px] px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-input bg-surface hover:bg-cream-deep",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        id="stack-panel"
        role="tabpanel"
        aria-labelledby={`stack-${guide.id}`}
        className="mt-4"
      >
        <p className="text-sm text-muted-foreground">{guide.instruction}</p>
        <div className="mt-3 overflow-hidden rounded-2xl bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
            <span className="truncate font-mono text-xs text-muted-foreground">
              {guide.target}
            </span>
            <CopyButton value={code} />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
