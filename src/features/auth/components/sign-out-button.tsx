import { signOutAction } from "../services/sign-out";
import { SubmitButton } from "@/components/shared/submit-button";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <SubmitButton variant="outline">Se déconnecter</SubmitButton>
    </form>
  );
}
