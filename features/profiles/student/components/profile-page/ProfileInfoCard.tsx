"use client";

import { useEffect, useState } from "react";

import { Mail, CalendarDays, GraduationCap } from "lucide-react";

import { MOCK_USER_INFO } from "@/shared/lib/mock-data";
import {
  getSessionUser,
  type SessionUser,
} from "@/features/auth/lib/mock-auth";

// Section 1 — Info Card: avatar (initials fallback), name, role, field,
// email, studies, and join date. Now bound to the SESSION user (the account
// that logged in via the mock sign-in / registration flow), falling back to
// the shared mock identity when nobody is logged in.
export function ProfileInfoCard() {
  // --- Session state ---------------------------------------------------------
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setSessionUser(getSessionUser(MOCK_USER_INFO.name));
  }, []);

  // --- Derived display values --------------------------------------------------
  // Real session data wins; the shared mock fills any gaps (seeded users have
  // no registration profile fields, and logged-out browsing shows the mock).
  const name = sessionUser?.name ?? MOCK_USER_INFO.name;
  const email = sessionUser?.email || MOCK_USER_INFO.email;
  const role = sessionUser?.role ?? MOCK_USER_INFO.role;
  const field = sessionUser?.userField ?? MOCK_USER_INFO.field;
  const studies = sessionUser?.university ?? MOCK_USER_INFO.studies;
  const joinedOn = MOCK_USER_INFO.joinedOn; // not captured at registration — mock only
  const avatarUrl = MOCK_USER_INFO.avatarUrl;

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar: real image when available, initials fallback otherwise */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="size-20 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary-tint text-2xl font-semibold text-primary-text">
            {initials}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate text-2xl font-semibold text-primary-text">
              {name}
            </h1>
            <span className="rounded-full bg-primary-tint px-3 py-0.5 text-xs font-medium capitalize text-primary-text">
              {role}
            </span>
          </div>

          <p className="mt-1 truncate text-sm text-muted-foreground">
            {field}
          </p>

          <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              {email}
            </span>
            {studies ? (
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 shrink-0" />
                {studies}
              </span>
            ) : null}
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0" />
              Joined {joinedOn}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
