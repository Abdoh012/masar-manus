import type { Metadata } from "next";
import { Suspense } from "react";

import { ProfilePage } from "@/features/profiles/student/components/profile-page/ProfilePage";
import { CertificatesProvider } from "@/shared/components/providers/CertificatesProvider";
import { SectionSkeleton } from "@/shared/components/loading/SectionSkeleton";

export const metadata: Metadata = {
  title: "My Profile",
};

// Thin composition point (same pattern as /certificates): the route imports
// only from the feature index + shared. CertificatesProvider wraps the page
// so ProfileCertificates reads the same shared state as the Certificates page.
export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<SectionSkeleton />}>
        <CertificatesProvider>
          <ProfilePage />
        </CertificatesProvider>
      </Suspense>
    </main>
  );
}
