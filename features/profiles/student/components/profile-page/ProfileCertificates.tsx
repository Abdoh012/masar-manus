"use client";

// Section 2 — Certificates: renders the SAME earned-certificate data as the
// dedicated Certificates page by consuming the shared CertificatesContext.
// Nothing here reads from a local constants file.

import { Award } from "lucide-react";

import { useCertificates } from "@/shared/components/providers/CertificatesProvider";

export function ProfileCertificates() {
  const { earned, earnedCount } = useCertificates();

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-medium text-primary-text">
          <Award className="h-5 w-5" />
          Certificates
        </h2>
        <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-xs font-medium text-primary-text">
          {earnedCount}
        </span>
      </div>

      {earned.length > 0 ? (
        <ul className="space-y-3">
          {earned.map((cert) => (
            <li
              key={cert.certId}
              className="rounded-xl border border-border bg-background p-4"
            >
              <p className="truncate font-medium text-foreground">{cert.title}</p>
              <p className="truncate text-sm text-muted-foreground">
                {cert.companyName}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {cert.certId} · Issued {cert.issuedOn}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No certificates yet — complete a training to earn your first
          certificate.
        </p>
      )}
    </section>
  );
}
