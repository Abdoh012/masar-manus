// ---------------------------------------------------------------------------
// Shared mock data — the SINGLE source of truth for the signed-in student.
// Promoted to top-level shared/ per rule R7 because it is consumed by more
// than one feature (profiles, certificates, applications). Both the Profile
// page and the dedicated Certificates page read certificates from HERE —
// never from a component-local constants file.
// ---------------------------------------------------------------------------

import type { CertificateDocument } from "@/features/certificates/shared/types";
import type { EligibleCertificate } from "@/features/certificates/student/types";
import type { MyApplication } from "@/features/applications/student/types";
import type { ListingCardData } from "@/features/listings/shared/types";

// --- User info ---------------------------------------------------------------

export interface MockUserInfo {
  name: string;
  initials: string;
  email: string;
  role: "student" | "company" | "admin";
  field: string;
  studies?: string;
  joinedOn: string;
  avatarUrl?: string; // undefined → fall back to initials avatar
}

export const MOCK_USER_INFO: MockUserInfo = {
  name: "Nour El-Sayed",
  initials: "NE",
  email: "nour.elsayed@example.com",
  role: "student",
  field: "Software Engineering",
  studies: "Faculty of Computers & Information, Cairo University",
  joinedOn: "March 2026",
};

// --- Certificates (SHARED with the Certificates page) ------------------------
// These are the exact records previously held in
// features/certificates/student/components/my-certificates/constants.ts.
// That file now re-exports from here so both pages render the same data.

export const MOCK_EARNED_CERTIFICATES: CertificateDocument[] = [
  {
    studentName: "Nour El-Sayed",
    title: "Software Engineering Internship",
    field: "Software Engineering",
    companyName: "Hala Bank",
    issuedOn: "June 15, 2026",
    certId: "CERT-2026-EG-00482",
  },
];

export const MOCK_ELIGIBLE_CERTIFICATES_SHARED: EligibleCertificate[] = [
  {
    id: "cert-001",
    listingId: "lst-001",
    listingTitle: "Software Engineering Internship",
    companyName: "Hala Bank",
    completedOn: "2026-06-15",
    requestStatus: "not-requested",
    mayLeadToHire: true,
  },
  {
    id: "cert-002",
    listingId: "lst-002",
    listingTitle: "Data Science Trainee",
    companyName: "NileGrants",
    completedOn: "2026-05-20",
    requestStatus: "not-requested",
  },
];

// --- Applications (SHARED with the My Applications page) ---------------------
// The FULL applications list — the exact records previously held in
// features/applications/student/components/my-applications/constants.ts.
// The My Applications page renders this whole list; the Profile page renders
// the N most recent via getRecentApplications(). Both read from HERE.

// listingId values reference MOCK_TRAININGS ids (36/41/52/63/73) so the
// 'View Listing' button on every card resolves to a real details page.
export const MOCK_APPLICATIONS_SHARED: MyApplication[] = [
  {
    id: "app-1042",
    listingId: "36",
    listingTitle: "Spring Boot Engineer Trainee",
    companyName: "Sawari Digital",
    status: "Accepted",
    appliedOn: "2026-07-20",
    mayLeadToHire: true,
    trial: { daysRemaining: 12, continuePastTrial: true },
  },
  {
    id: "app-1018",
    listingId: "63",
    listingTitle: "DevOps Apprentice",
    companyName: "CloudiTech",
    status: "Accepted",
    appliedOn: "2026-07-10",
    trial: { daysRemaining: 0 },
  },
  {
    id: "app-0991",
    listingId: "41",
    listingTitle: "React Frontend Intern",
    companyName: "Mobica Alexandria",
    status: "Rejected",
    appliedOn: "2026-07-02",
    rejectionReason: "The position was filled by an internal candidate.",
  },
  {
    id: "app-1010",
    listingId: "73",
    listingTitle: "Frontend Developer Program",
    companyName: "Orbit Software",
    status: "Withdrawn",
    appliedOn: "2026-06-28",
  },
  {
    id: "app-0977",
    listingId: "52",
    listingTitle: "Quality & Test Engineer Program",
    companyName: "StartApp Hub",
    status: "Applied",
    appliedOn: "2026-06-15",
    mayLeadToHire: true,
  },
  {
    id: "app-0953",
    listingId: "41",
    listingTitle: "React Frontend Intern",
    companyName: "Mobica Alexandria",
    status: "Applied",
    appliedOn: "2026-05-30",
  },
  {
    id: "app-0922",
    listingId: "36",
    listingTitle: "Spring Boot Engineer Trainee",
    companyName: "Sawari Digital",
    status: "Rejected",
    appliedOn: "2026-05-12",
  },
  {
    id: "app-0890",
    listingId: "73",
    listingTitle: "Frontend Developer Program",
    companyName: "Orbit Software",
    status: "Accepted",
    appliedOn: "2026-04-20",
  },
];

// Returns the N most recent applications, sorted newest-first by appliedOn —
// the same ordering the My Applications page uses (b.appliedOn.localeCompare).
export function getRecentApplications(count = 3): MyApplication[] {
  return [...MOCK_APPLICATIONS_SHARED]
    .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))
    .slice(0, count);
}

// --- Trainings catalog (SHARED: browse page + training details page) ---------
// The single source of truth for trainings. The Trainings browse page renders
// these cards; the dynamic details page (/listings/[id]) looks the training
// up by id from THIS SAME array via findTrainingById(). The My Applications
// 'View Listing' button navigates to /listings/{listingId}, so every
// application's listingId below matches one of these ids.

export const MOCK_TRAININGS: ListingCardData[] = [
  {
    id: "36",
    companyId: "c-sawari",
    companyName: "Sawari Digital",
    field: "Software Engineering",
    specialization: "Spring Boot Engineer Trainee",
    description:
      "Hands-on backend training on real production Java services. You'll pair with senior engineers, ship small features behind feature flags, and learn Spring Boot, PostgreSQL, and observability in a live SaaS environment.",
    mode: "hands_on",
    format: "hybrid",
    hireIntent: true,
    isPaid: true,
    price: 180,
    trialDays: 7,
    status: "published",
    createdAt: "2026-08-01",
    updatedAt: "2026-08-01",
  },
  {
    id: "41",
    companyId: "c-mobica",
    companyName: "Mobica Alexandria",
    field: "Software Engineering",
    specialization: "React Frontend Intern",
    description:
      "Learn the React stack while shadowing the product team. Contribute to component libraries, learn TypeScript and testing, and get direct code review from frontend leads.",
    mode: "observer",
    format: "in_person",
    hireIntent: false,
    isPaid: false,
    status: "published",
    createdAt: "2026-08-04",
    updatedAt: "2026-08-04",
  },
  {
    id: "52",
    companyId: "c-startapp",
    companyName: "StartApp Hub",
    field: "Software Engineering",
    specialization: "Quality & Test Engineer Program",
    description:
      "Project-based QA training across web and mobile products. Write test plans, automate E2E suites, and learn how quality gates protect every release.",
    mode: "hands_on",
    format: "remote",
    hireIntent: true,
    isPaid: false,
    status: "published",
    createdAt: "2026-08-06",
    updatedAt: "2026-08-06",
  },
  {
    id: "63",
    companyId: "c-clouditech",
    companyName: "CloudiTech",
    field: "Software Engineering",
    specialization: "DevOps Apprentice",
    description:
      "Build CI/CD pipelines and infrastructure as code. Work on Kubernetes, Terraform, and monitoring while owning real environments under mentorship.",
    mode: "project_based",
    format: "hybrid",
    hireIntent: true,
    isPaid: true,
    price: 240,
    trialDays: 14,
    status: "published",
    createdAt: "2026-08-08",
    updatedAt: "2026-08-08",
  },
  {
    id: "73",
    companyId: "c-orbit",
    companyName: "Orbit Software",
    field: "Software Engineering",
    specialization: "Frontend Developer Program",
    description:
      "Ship accessible interfaces with a senior mentor. Cover React, design systems, and performance, ending with a portfolio project you own.",
    mode: "hands_on",
    format: "remote",
    hireIntent: true,
    isPaid: true,
    price: 200,
    trialDays: 7,
    status: "published",
    createdAt: "2026-08-07",
    updatedAt: "2026-08-07",
  },
];

// Lookup used by the dynamic Training Details page. Returns undefined for an
// unknown id — the page renders its 'Training not found' fallback in that case.
export function findTrainingById(id: string): ListingCardData | undefined {
  return MOCK_TRAININGS.find((training) => training.id === id);
}
