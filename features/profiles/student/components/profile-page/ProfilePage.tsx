// Profile page composition: Info Card full-width on top, Certificates and
// Recent Applications in a two-column grid that collapses on mobile.

import { ProfileInfoCard } from "./ProfileInfoCard";
import { ProfileCertificates } from "./ProfileCertificates";
import { ProfileRecentApplications } from "./ProfileRecentApplications";

export function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <ProfileInfoCard />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* <ProfileCertificates /> */}
        <ProfileRecentApplications />
      </section>
    </div>
  );
}
