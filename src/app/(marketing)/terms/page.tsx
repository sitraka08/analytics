import type { Metadata } from "next";
import { LegalPage, TERMS } from "@/features/legal";

export const metadata: Metadata = { title: "Conditions d'utilisation" };

export default function Page() {
  return <LegalPage document={TERMS} />;
}
