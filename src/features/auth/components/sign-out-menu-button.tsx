import { LogOut } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { signOutAction } from "../services/sign-out";

// Compact sign-out for the dashboard sidebar; the pill version lives in SignOutButton.
export function SignOutMenuButton() {
  return (
    <form action={signOutAction}>
      <SidebarMenuButton type="submit" tooltip="Se déconnecter">
        <LogOut aria-hidden />
        <span>Se déconnecter</span>
      </SidebarMenuButton>
    </form>
  );
}
