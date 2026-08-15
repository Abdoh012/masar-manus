import type { ListingCardData } from "../../../shared/types";
import { MOCK_TRAININGS } from "@/shared/lib/mock-data";

// Listing detail constants (R-8; structure rules §14 — no inline data).
// The detail listings are DERIVED from the shared trainings catalog
// (shared/lib/mock-data.ts) — the same array the browse page renders — so a
// training card and its details page can never drift apart. Keyed by id for
// O(1) lookup by ListingDetailContainer.

export const MOCK_DETAIL_LISTINGS: Record<string, ListingCardData> =
  Object.fromEntries(MOCK_TRAININGS.map((training) => [training.id, training]));

// Listings the mock student has already applied to (FR-017, UI-only marker).
export const MOCK_APPLIED_LISTING_IDS: string[] = ["41"];

export const APPLY_COPY = {
  title: "Apply to this training",
  button: "Apply now",
  applied: "You already applied",
  appliedMessage: "Your application is in. The company will reach out if you're shortlisted.",
  noteLabel: "Add a note",
  notePlaceholder: "Optional — tell the company why you're a good fit",
  success: "Application sent",
  successMessage: "Your application was recorded for this session.",
};

export const DETAIL_META = {
  company: "Company",
  field: "Field",
  format: "Format",
  posted: "Posted",
};

export const DETAIL_COPY = {
  backToBrowse: "Back to browse",
};
