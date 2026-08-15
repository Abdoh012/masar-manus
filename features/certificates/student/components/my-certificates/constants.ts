import type { CertificateSummary } from "../../types";

// The certificate records themselves have been promoted to the shared mock
// data file (shared/lib/mock-data.ts) so the Profile page and this page
// render the exact same data. Re-exported here for backward compatibility
// with any existing imports.
export {
  MOCK_EARNED_CERTIFICATES as MOCK_CERTIFICATES,
  MOCK_ELIGIBLE_CERTIFICATES_SHARED as MOCK_ELIGIBLE_CERTIFICATES,
} from "@/shared/lib/mock-data";

// Empty variant: no certificates → NoCertificatesYet state.
export const MOCK_CERTIFICATES_NONE: CertificateSummary = {
  totalCount: 0,
  mostRecent: null,
};

// Format a certificate issue date as a short display date.
// Parsed in UTC so the value never shifts across timezones.
const SHORT_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatCertificateDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return SHORT_DATE.format(new Date(Date.UTC(year, month - 1, day)));
}

// Empty variants per UX expectation #7.
export const CERTIFICATES_EMPTY: CertificateSummary = {
  totalCount: 0,
  mostRecent: null,
};

// Copy labels for empty states.
export const EMPTY_STATE_LABELS = {
  bothEmpty: "No certificates yet — complete a training to earn your first certificate.",
  eligibleOnly: "No eligible trainings yet — complete a training to receive a certificate.",
  earnedOnly: "Your completed trainings will appear here once you request a certificate.",
};