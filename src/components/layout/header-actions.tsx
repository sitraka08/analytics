"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type HeaderSlot = {
  node: HTMLElement | null;
  setNode: (node: HTMLElement | null) => void;
};

const HeaderSlotContext = createContext<HeaderSlot | null>(null);

export function HeaderSlotProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const value = useMemo(() => ({ node, setNode }), [node]);

  return (
    <HeaderSlotContext.Provider value={value}>
      {children}
    </HeaderSlotContext.Provider>
  );
}

/** Where the page's header controls land, on the right of the sticky dashboard header. */
export function HeaderSlot({ className }: { className?: string }) {
  const slot = useContext(HeaderSlotContext);
  return <div ref={slot?.setNode} className={className} />;
}

/** Renders the page's controls (period, later plan badges) into the dashboard header, keeping the page's React context. */
export function HeaderActions({ children }: { children: React.ReactNode }) {
  const node = useContext(HeaderSlotContext)?.node;
  return node ? createPortal(children, node) : null;
}
