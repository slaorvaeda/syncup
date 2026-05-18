"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isStaff } from "@/lib/roles";
import { isInternalPath } from "@/lib/routes";
import FeedForm from "@/components/feed/FeedForm";
import AuthPanel, { STAFF_REGISTER_ROLES } from "@/components/auth/AuthPanel";
import Logo from "@/components/common/Logo";
import Alert from "@/components/common/Alert";
import Badge from "@/components/common/Badge";
import Spinner from "@/components/common/Spinner";

const STAFF_ROLES = ["coach", "admin"];

const ROLE_HINTS = [
  {
    role: "Coach",
    description: "Publish tips, announcements, and reminders to the public feed.",
  },
  {
    role: "Admin",
    description: "Everything coaches can do, plus manage users from the sidebar.",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, isAuthenticated } = useAuth();
  const staff = isStaff(user);

  const handleAuthSuccess = () => {
    const returnTo = searchParams.get("redirect");
    if (returnTo && isInternalPath(returnTo)) {
      router.replace(returnTo);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner label="Loading session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Logo size={48} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Staff portal
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in to SyncUp
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Coaches publish feeds. Admins can also manage users.
          </p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {ROLE_HINTS.map((hint) => (
            <div
              key={hint.role}
              className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {hint.role}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {hint.description}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <AuthPanel
            allowedRoles={STAFF_ROLES}
            roleOptions={STAFF_REGISTER_ROLES}
            loginTitle="Staff sign in"
            registerTitle="Create staff account"
            onSuccess={handleAuthSuccess}
          />
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <Alert variant="error">
        This area is for coaches and admins only. Your account role is{" "}
        <strong className="capitalize">{user?.role}</strong>.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Publish
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
            Create feed post
          </h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            Write your message, add media, and choose who can see it. Published
            posts appear on the public home feed in real time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="capitalize">
            {user.role}
          </Badge>
          <span className="text-sm text-zinc-500">{user.name}</span>
        </div>
      </header>

      {user.role === "admin" && (
        <Alert variant="info">
          As an admin, open <strong>Users</strong> in the sidebar to manage
          accounts.
        </Alert>
      )}

      <FeedForm />
    </div>
  );
}
