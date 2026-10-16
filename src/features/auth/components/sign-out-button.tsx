import { AUTH_COPY } from "../constants/content";
import { signOutAction } from "../services/sign-out";
import { SubmitButton } from "./submit-button";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <SubmitButton variant="outline">{AUTH_COPY.signOut}</SubmitButton>
    </form>
  );
}
