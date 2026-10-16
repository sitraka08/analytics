import type { Metadata } from "next";
import { LegalPage, PRIVACY } from "@/features/legal";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function Page() {
  return <LegalPage document={PRIVACY} />;
}
