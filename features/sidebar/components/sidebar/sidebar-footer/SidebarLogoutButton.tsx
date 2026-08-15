"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { SidebarMenuButton } from "@/shared/components/ui/sidebar";
import { mockSignOut } from "@/features/auth/lib/mock-auth";

import {
  SIDEBAR_FOOTER_LABEL,
  SIDEBAR_FOOTER_ROW,
  SIDEBAR_LABEL_TRACK,
  SIDEBAR_LABELS,
} from "../constants";

export function SidebarLogoutButton() {
  const router = useRouter();

  // --- Handler -------------------------------------------------------------
  function handleLogout() {
    mockSignOut();                 // clears masarJwt / masarRole / companyStatus
    router.push("/sign-in");       // redirect to the public auth route
    router.refresh();              // re-run middleware/layouts against cleared state
  }

  return (
    <SidebarMenuButton
      asChild
      tooltip={SIDEBAR_LABELS.logout}
      className={SIDEBAR_FOOTER_ROW}
    >
      <button type="button" onClick={handleLogout}>   {/* CHANGED: added onClick */}
        <LogOut strokeWidth={2} />
        <span className={SIDEBAR_FOOTER_LABEL}>
          <span className={SIDEBAR_LABEL_TRACK}>{SIDEBAR_LABELS.logout}</span>
        </span>
      </button>
    </SidebarMenuButton>
  );
}
