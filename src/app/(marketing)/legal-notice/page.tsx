import type { Metadata } from "next";
import { LegalPage, LEGAL_NOTICE } from "@/features/legal";

export const metadata: Metadata = { title: "Mentions légales" };

export default function Page() {
  return <LegalPage document={LEGAL_NOTICE} />;
}
