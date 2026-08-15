import type { ReactNode } from "react";

import { Sidebar } from "@/features/sidebar";
import { ApplicationsProvider } from "@/shared/components/providers/ApplicationsProvider";
import { CertificatesProvider } from "@/shared/components/providers/CertificatesProvider";
import { Toaster } from "sonner";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <Sidebar role="student">
      <Toaster />
      {/* Shared stores for every student surface (dashboard, listings,
          applications, certificates, profile): one applications list and one
          certificates list, both persisted to localStorage. */}
      <ApplicationsProvider>
        <CertificatesProvider>{children}</CertificatesProvider>
      </ApplicationsProvider>
    </Sidebar>
  );
}
