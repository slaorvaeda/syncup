"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUsers } from "@/lib/api";
import Badge from "@/components/common/Badge";
import Spinner from "@/components/common/Spinner";
import Alert from "@/components/common/Alert";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";

export default function UsersPage() {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      setLoading(false);
      return;
    }

    getUsers()
      .then((res) => setUsers(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated, isAdmin]);

  return (
    <>
      <section className="mb-6">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Users</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage all registered accounts (admin only).
          </p>
        </section>

        {loading && (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          )}

          {error && <Alert variant="error">{error}</Alert>}

          {!loading && users.length === 0 && (
            <EmptyState
              title="No users"
              description="No users found in the system."
            />
          )}

          {!loading && users.length > 0 && (
            <>
              <div className="space-y-3 md:hidden">
                {users.map((u) => (
                  <article
                    key={u._id}
                    className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {u.name}
                    </p>
                    <p className="mt-1 break-all text-sm text-zinc-600 dark:text-zinc-400">
                      {u.email}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="default" className="capitalize">
                        {u.role}
                      </Badge>
                      <span className="text-xs text-zinc-500">
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white md:block dark:border-zinc-800 dark:bg-zinc-950">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="hidden px-4 py-3 font-medium sm:table-cell">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                      >
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                          {u.email}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="default" className="capitalize">
                            {u.role}
                          </Badge>
                        </td>
                        <td className="hidden px-4 py-3 sm:table-cell">
                          {u.isActive ? "Active" : "Inactive"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
    </>
  );
}
