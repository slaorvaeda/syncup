"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getMe } from "@/lib/api";
import Badge from "@/components/common/Badge";
import Spinner from "@/components/common/Spinner";
import Alert from "@/components/common/Alert";
import { formatRelativeTime, getInitials } from "@/lib/format";

export default function ProfilePage() {
  const { user: cachedUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getMe()
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const user = profile || cachedUser;

  return (
    <>
      <h1 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
        Profile
      </h1>

          {loading && <Spinner label="Loading profile..." />}
          {error && <Alert variant="error">{error}</Alert>}

          {user && !loading && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {user.email}
                  </p>
                  <Badge variant="default" className="mt-2 capitalize">
                    {user.role}
                  </Badge>
                </div>
              </div>

              <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-zinc-500">Program</dt>
                  <dd className="font-medium">{user.programId || "—"}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Cohort</dt>
                  <dd className="font-medium">{user.cohortId || "—"}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Status</dt>
                  <dd className="font-medium">
                    {user.isActive ? "Active" : "Inactive"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Member since</dt>
                  <dd className="font-medium">
                    {user.createdAt
                      ? formatRelativeTime(user.createdAt)
                      : "—"}
                  </dd>
                </div>
              </dl>
            </div>
          )}
    </>
  );
}
