"use client";

// ---------------------------------------------------------------------------
// Shared certificates state — React Context consumed by BOTH the Profile page
// and the dedicated Certificates page, so both always render the same data.
// Seeded from shared/lib/mock-data.ts (the single source of truth).
// ---------------------------------------------------------------------------

import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

import type { CertificateDocument } from "@/features/certificates/shared/types";
import type { EligibleCertificate } from "@/features/certificates/student/types";
import {
  MOCK_EARNED_CERTIFICATES,
  MOCK_ELIGIBLE_CERTIFICATES_SHARED,
} from "@/shared/lib/mock-data";

interface CertificatesContextValue {
  earned: CertificateDocument[];
  eligible: EligibleCertificate[];
  earnedCount: number;
  // Marks an eligible certificate as requested (pending). Shared, so a request
  // made on the Certificates page is immediately reflected on the Profile page.
  requestCertificate: (id: string) => void;
}

const CertificatesContext = createContext<CertificatesContextValue | null>(null);

export function CertificatesProvider({ children }: { children: ReactNode }) {
  const [earned] = useState<CertificateDocument[]>(MOCK_EARNED_CERTIFICATES);
  const [eligible, setEligible] = useState<EligibleCertificate[]>(
    MOCK_ELIGIBLE_CERTIFICATES_SHARED,
  );

  function requestCertificate(id: string) {
    setEligible((prev) =>
      prev.map((cert) =>
        cert.id === id ? { ...cert, requestStatus: "pending" } : cert,
      ),
    );
  }

  const value = useMemo<CertificatesContextValue>(
    () => ({
      earned,
      eligible,
      earnedCount: earned.length,
      requestCertificate,
    }),
    [earned, eligible],
  );

  return (
    <CertificatesContext.Provider value={value}>
      {children}
    </CertificatesContext.Provider>
  );
}

// Hook consumed by both pages. Throws if used outside the provider so a
// missing provider is caught at development time, not as a silent empty UI.
export function useCertificates(): CertificatesContextValue {
  const ctx = useContext(CertificatesContext);
  if (!ctx) {
    throw new Error("useCertificates must be used inside <CertificatesProvider>");
  }
  return ctx;
}
