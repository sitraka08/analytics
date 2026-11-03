import { LogOut } from "lucide-react";
import { signOutAction } from "../services/sign-out";

// Compact sign-out for the dashboard account menu; the pill version lives in SignOutButton.
export function SignOutMenuButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-cream-deep focus-visible:outline-2 focus-visible:outline-foreground [&_svg]:size-4"
      >
        <LogOut aria-hidden />
        Se déconnecter
      </button>
    </form>
  );
}
