"use client";

import { Award } from "lucide-react";

import { CertificateDocument } from "@/features/certificates/shared/components/certificate-document/CertificateDocument";
import Motion from "@/shared/components/animation/Motion";
import { fadeInUp, scaleIn } from "@/shared/lib/animations";
import { NoCertificatesYet } from "./NoCertificatesYet";
import { useCertificates } from "@/shared/components/providers/CertificatesProvider";

// CertificatesSnapshot: total count + the most recent certificate rendered as
// the identity's certificate document (reuses the shared CertificateDocument).
// Metrics are now read from the SHARED certificates context — the same source
// as the Certificates page and the Profile page.
export function CertificatesSnapshot() {
  // --- Shared state + calculated metrics -------------------------------------
  const { earned, earnedCount } = useCertificates();
  const totalCount = earnedCount;          // replaces hardcoded totalCount
  const mostRecent = earned[0] ?? null;    // replaces hardcoded mostRecent

  return (
    <Motion
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex items-center justify-between gap-2">
        {/* Header */}
        <h2 className="flex items-center gap-2 text-base font-semibold text-primary-text">
          <span className="flex size-6 items-center justify-center rounded-full bg-secondary-tint text-secondary-text">
            <Award className="size-3.5" />
          </span>
          Certificates
        </h2>

        {/* the most recent certificate count badge */}
        {mostRecent ? (
          <span className="shrink-0 rounded-full bg-secondary-tint px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-text">
            {totalCount} certificates
          </span>
        ) : null}
      </div>

      {/* Certificate content (either the recent certificate document or the empty state) */}
      {mostRecent ? (
        <div className="mt-4">
          <Motion
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-xl shadow-card-sm"
          >
            <CertificateDocument data={mostRecent} compact />
          </Motion>

          {/* Verified certificate badge */}
          <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">
            Verified certificate · Issued {mostRecent.issuedOn}
          </p>
        </div>
      ) : (
        <NoCertificatesYet />
      )}
    </Motion>
  );
}
