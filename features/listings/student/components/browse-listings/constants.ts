import { LISTING_FORMATS, LISTING_MODES } from "../../../shared/lib/constants";
import type { ListingMode } from "../../../shared/types";
import type { BrowseListing, ListingFiltersState } from "../../types";
import { MOCK_TRAININGS } from "@/shared/lib/mock-data";

// Student browse constants (R-8; structure rules §14 — no inline data).
// MOCK_BROWSE_LISTINGS is pre-scoped to the student's field ("Software
// Engineering") — the server-side auto-scope (architecture §1) is deferred to
// backend integration; this mock stands in for that scoped result. UI-only.
//
// The listings themselves live in the SHARED trainings catalog
// (shared/lib/mock-data.ts) — the same array the dynamic details page looks
// up by id — so a card on this page and its details page always match.

export const MOCK_BROWSE_LISTINGS: BrowseListing[] = MOCK_TRAININGS;

export const FILTER_LABELS = {
  mode: "Mode",
  format: "Format",
  paid: "Price",
  reset: "Reset filters",
  title: "Filters",
  allModes: "All modes",
  allFormats: "All formats",
  any: "Any",
};

// Filter option lists (FR-013). Reused directly so the form and filters can
// never drift from each other (R-1). "paid" is a ternary control with a
// neutral "Any" state.
export const FILTER_LISTS = {
  mode: [...LISTING_MODES] as { value: ListingMode; label: string }[],
  format: [...LISTING_FORMATS] as { value: "in_person" | "remote" | "hybrid"; label: string }[],
  paid: [
    { value: "any", label: FILTER_LABELS.any },
    { value: "free", label: "Free" },
    { value: "paid", label: "Paid" },
  ] as { value: "any" | "free" | "paid"; label: string }[],
};

// No-filter default state (FR-013).
export const DEFAULT_FILTERS: ListingFiltersState = { mode: "", format: "", paid: "any" };

export const BROWSE_EMPTY_STATE = {
  title: "No trainings match your filters",
  message: "Try clearing a filter or two to see more options.",
};
