"use client";

// ---------------------------------------------------------------------------
// Shared applications state — React Context + localStorage persistence.
// Consumed by THREE surfaces, all rendering the SAME live list:
//   1. Trainings page (ApplyCta)          → apply() + hasApplied()
//   2. My Applications page               → applications + withdraw()
//   3. Profile page (Recent Applications) → recentApplications()
// Seeded from shared/lib/mock-data.ts on first load; afterwards localStorage
// (key below) is the source of truth, so applications survive page reloads.
// ---------------------------------------------------------------------------

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { MyApplication } from "@/features/applications/student/types";
import { MOCK_APPLICATIONS_SHARED } from "@/shared/lib/mock-data";

export const APPLICATIONS_STORAGE_KEY = "masarApplications";

// Details about the training being applied to — supplied by the Apply button.
export interface ApplyDetails {
  listingTitle: string;
  companyName: string;
  mayLeadToHire?: boolean;
}

export type ApplyResult =
  | { success: true; application: MyApplication }
  | { success: false; error: string };

interface ApplicationsContextValue {
  applications: MyApplication[];
  // True once the initial localStorage read has happened (avoids hydration
  // mismatch: the first client render always matches the server render).
  hydrated: boolean;
  apply: (trainingId: string, details: ApplyDetails) => ApplyResult;
  withdraw: (applicationId: string) => void;
  hasApplied: (trainingId: string) => boolean;
  recentApplications: (count?: number) => MyApplication[];
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);

function readStoredApplications(): MyApplication[] {
  try {
    const raw = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MyApplication[];
  } catch {
    // corrupted value — fall through and reseed
  }
  localStorage.setItem(
    APPLICATIONS_STORAGE_KEY,
    JSON.stringify(MOCK_APPLICATIONS_SHARED),
  );
  return MOCK_APPLICATIONS_SHARED;
}

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  // Seed with the shared mock list so server and first client render match.
  const [applications, setApplications] = useState<MyApplication[]>(
    MOCK_APPLICATIONS_SHARED,
  );
  const [hydrated, setHydrated] = useState(false);

  // On mount: rehydrate from localStorage (covers reloads + earlier applies).
  useEffect(() => {
    setApplications(readStoredApplications());
    setHydrated(true);
  }, []);

  // Every state change is mirrored to localStorage.
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
    }
  }, [applications, hydrated]);

  const hasApplied = useCallback(
    (trainingId: string) =>
      applications.some((application) => application.listingId === trainingId),
    [applications],
  );

  // Apply for a training. Duplicate applications are rejected with an error
  // result — the same listingId can never appear twice in the list.
  const apply = useCallback(
    (trainingId: string, details: ApplyDetails): ApplyResult => {
      let result: ApplyResult | null = null;

      setApplications((current) => {
        if (current.some((application) => application.listingId === trainingId)) {
          result = {
            success: false,
            error: "You have already applied for this training.",
          };
          return current; // unchanged — duplicate prevented
        }

        const application: MyApplication = {
          id: `app-${Date.now()}`,
          listingId: trainingId,
          listingTitle: details.listingTitle,
          companyName: details.companyName,
          status: "Applied",
          appliedOn: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
          mayLeadToHire: details.mayLeadToHire,
        };

        result = { success: true, application };
        return [application, ...current]; // newest first
      });

      // setApplications with an updater runs synchronously in React 18/19
      // event handlers, so `result` is populated by the time we return.
      return result ?? { success: false, error: "Unable to apply right now." };
    },
    [],
  );

  const withdraw = useCallback((applicationId: string) => {
    setApplications((current) =>
      current.map((application) =>
        application.id === applicationId
          ? { ...application, status: "Withdrawn" }
          : application,
      ),
    );
  }, []);

  // N most recent applications, newest-first — the exact ordering the My
  // Applications page uses (localeCompare on ISO dates).
  const recentApplications = useCallback(
    (count = 3) =>
      [...applications]
        .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))
        .slice(0, count),
    [applications],
  );

  const value = useMemo<ApplicationsContextValue>(
    () => ({
      applications,
      hydrated,
      apply,
      withdraw,
      hasApplied,
      recentApplications,
    }),
    [applications, hydrated, apply, withdraw, hasApplied, recentApplications],
  );

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
}

// Hook consumed by all three surfaces. Throws outside the provider so a
// missing provider fails loudly in development instead of rendering empty UI.
export function useApplications(): ApplicationsContextValue {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) {
    throw new Error("useApplications must be used inside <ApplicationsProvider>");
  }
  return ctx;
}
