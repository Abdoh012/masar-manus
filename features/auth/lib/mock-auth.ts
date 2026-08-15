// ---------------------------------------------------------------------------
// Mock authentication logic — no real backend required.
// Swap these functions for real API calls (features/auth/services.ts) later.
// ---------------------------------------------------------------------------

export interface MockUser {
  email: string;
  password: string;
  role: "student" | "company" | "admin";
  companyStatus?: "pending" | "approved" | "rejected";
  // Optional profile fields captured by the multi-step registration flow.
  fullName?: string;
  companyName?: string;
  userField?: string;
  specialist?: string;
  university?: string;
  description?: string;
}

// Hardcoded mock users. On first sign-in attempt these are seeded into
// localStorage under MOCK_USERS_KEY; after that, localStorage is the source
// of truth (so you can add users from the console or a mock sign-up later).
export const MOCK_USERS: MockUser[] = [
  { email: "student@masar.com", password: "password123", role: "student" },
  { email: "company@masar.com", password: "password123", role: "company", companyStatus: "approved" },
  { email: "pending@masar.com", password: "password123", role: "company", companyStatus: "pending" },
  { email: "admin@masar.com", password: "password123", role: "admin" },
];

export const MOCK_USERS_KEY = "masarMockUsers";
export const MOCK_TOKEN_KEY = "masarJwt"; // same cookie/token name the middleware reads

export type MockSignInResult =
  | { success: true; token: string; role: MockUser["role"]; redirectPath: string }
  | { success: false; error: string };

// Where each role lands after sign-in — mirrors config/routes.ts ROLE_HOME.
const MOCK_ROLE_HOME: Record<MockUser["role"], string> = {
  student: "/dashboard",
  company: "/company/dashboard",
  admin: "/admin/companies",
};

function readMockUsers(): MockUser[] {
  try {
    const raw = localStorage.getItem(MOCK_USERS_KEY);
    if (raw) return JSON.parse(raw) as MockUser[];
  } catch {
    // corrupted value — fall through and reseed
  }
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(MOCK_USERS));
  return MOCK_USERS;
}

// Generates a mock JWT-shaped token (header.payload.signature, base64url).
// The payload carries the role + company status so a protected route (or the
// real middleware later) can inspect it. NOT cryptographically secure.
export function generateMockToken(user: MockUser): string {
  const encode = (value: object) =>
    btoa(JSON.stringify(value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({
    sub: user.email,
    role: user.role,
    companyStatus: user.companyStatus ?? null,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90, // 90 days
  });
  const signature = btoa(`mock-signature-${Date.now()}`);

  return `${header}.${payload}.${signature}`;
}

// Mock async sign-in: simulates ~1s network latency, validates credentials
// against the mock user store, and returns a typed result for the UI to bind.
export function mockSignIn(email: string, password: string): Promise<MockSignInResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = readMockUsers();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!user || user.password !== password) {
        resolve({ success: false, error: "Invalid email or password" });
        return;
      }

      const token = generateMockToken(user);

      // Persist the session. localStorage is used so client components can
      // read it; the real flow sets HTTP-only cookies via services.ts instead.
      localStorage.setItem(MOCK_TOKEN_KEY, token);
      localStorage.setItem("masarRole", user.role);
      if (user.companyStatus) {
        localStorage.setItem("companyStatus", user.companyStatus);
      }

      // Pending companies are locked to the waiting page (mirrors proxy.ts).
      const redirectPath =
        user.role === "company" && user.companyStatus === "pending"
          ? "/company/pending-approval"
          : MOCK_ROLE_HOME[user.role];

      resolve({ success: true, token, role: user.role, redirectPath });
    }, 1000);
  });
}

// Mock sign-out: clears every session key the mock flow writes, so the next
// sign-in starts clean. Call this from your logout button, then redirect.
export function mockSignOut(): void {
  localStorage.removeItem(MOCK_TOKEN_KEY);   // "masarJwt"
  localStorage.removeItem("masarRole");
  localStorage.removeItem("companyStatus");
}

// ---------------------------------------------------------------------------
// Session read — the currently logged-in user, for dashboards/profile headers
// ---------------------------------------------------------------------------

export interface SessionUser {
  name: string;
  email: string;
  role: MockUser["role"];
  companyStatus?: MockUser["companyStatus"];
  // Profile fields captured during registration (present for users who
  // registered through the multi-step flow; undefined for seeded users).
  userField?: string;
  specialist?: string;
  university?: string;
  description?: string;
}

// Reads the current session from localStorage (token + role written by
// mockSignIn) and resolves the full user record from the mock users array.
// Returns null when nobody is logged in. `fallbackName` is used when the
// logged-in user's record predates the registration profile fields.
export function getSessionUser(fallbackName = "Nour El-Sayed"): SessionUser | null {
  const token = localStorage.getItem(MOCK_TOKEN_KEY);
  const role = localStorage.getItem("masarRole") as MockUser["role"] | null;
  if (!token || !role) return null;

  // The mock token's payload carries the account email as `sub`.
  let email: string | null = null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? ""));
    email = typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    email = null;
  }

  const record = email
    ? readMockUsers().find((u) => u.email.toLowerCase() === email!.toLowerCase())
    : undefined;

  return {
    name: record?.fullName ?? fallbackName,
    email: record?.email ?? email ?? "",
    role,
    companyStatus: record?.companyStatus,
    userField: record?.userField,
    specialist: record?.specialist,
    university: record?.university,
    description: record?.description,
  };
}

// ---------------------------------------------------------------------------
// Multi-step registration (Step 1 → Step 2) — draft persistence + mock DB write
// ---------------------------------------------------------------------------

// Step 1 data, carried to Step 2 via sessionStorage so navigating between
// steps (or a refresh on Step 2) never loses it. sessionStorage is used
// instead of localStorage because the draft is transient — it is cleared the
// moment registration succeeds.
export const REGISTER_DRAFT_KEY = "masarRegisterDraft";

export interface RegisterDraft {
  role: "student" | "company";
  fullName: string;
  email: string;
  password: string;
  companyName?: string;
}

export interface ProfileInformationData {
  userField: string;
  specialist: string;
  university: string;
  description?: string;
}

export type RegisterResult =
  | { success: true; user: MockUser }
  | { success: false; error: string };

export function saveRegisterDraft(draft: RegisterDraft): void {
  sessionStorage.setItem(REGISTER_DRAFT_KEY, JSON.stringify(draft));
}

export function readRegisterDraft(): RegisterDraft | null {
  try {
    const raw = sessionStorage.getItem(REGISTER_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as RegisterDraft) : null;
  } catch {
    return null;
  }
}

export function clearRegisterDraft(): void {
  sessionStorage.removeItem(REGISTER_DRAFT_KEY);
}

// Mock DB check: true when the email is already registered (case-insensitive).
export function mockEmailExists(email: string): boolean {
  const users = readMockUsers();
  return users.some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
}

// Mock async register: simulates ~1s latency, rejects duplicate emails, then
// appends the complete user (Step 1 + Step 2 combined) to the localStorage
// users array — the SAME array mockSignIn validates against, so a registered
// user can immediately log in. New companies start as "pending" (mirrors the
// backend's admin-approval rule).
export function mockRegister(
  draft: RegisterDraft,
  profile: ProfileInformationData,
): Promise<RegisterResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mockEmailExists(draft.email)) {
        resolve({
          success: false,
          error: "An account with this email already exists.",
        });
        return;
      }

      const users = readMockUsers();
      const user: MockUser = {
        email: draft.email.trim(),
        password: draft.password,
        role: draft.role,
        companyStatus:
          draft.role === "company" ? "pending" : undefined,
        fullName: draft.fullName,
        companyName: draft.companyName,
        userField: profile.userField,
        specialist: profile.specialist,
        university: profile.university,
        description: profile.description,
      };

      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([...users, user]));
      clearRegisterDraft();

      resolve({ success: true, user });
    }, 1000);
  });
}
