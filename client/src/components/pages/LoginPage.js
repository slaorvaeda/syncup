"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isStaff } from "@/lib/roles";
import AuthPanel from "@/components/auth/AuthPanel";
import Logo from "@/components/common/Logo";
import Spinner from "@/components/common/Spinner";
import { isInternalPath, ROUTES } from "@/lib/routes";

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, isAuthenticated, user } = useAuth();

  const redirectAfterAuth = () => {
    const returnTo = searchParams.get("redirect");
    if (returnTo && isInternalPath(returnTo)) {
      router.replace(returnTo);
      return;
    }
    router.replace(ROUTES.HOME);
  };

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    if (isStaff(user)) {
      router.replace(ROUTES.ADMIN_LOGIN);
      return;
    }

    const returnTo = searchParams.get("redirect");
    if (returnTo && isInternalPath(returnTo)) {
      router.replace(returnTo);
      return;
    }
    router.replace(ROUTES.HOME);
  }, [loading, isAuthenticated, user, router, searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading session..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Redirecting..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-1 py-6 sm:py-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <Logo size={48} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Member sign in
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Sign in to SyncUp
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Like and comment on coaching posts from the public feed.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <AuthPanel
          role="student"
          loginTitle="Sign in"
          registerTitle="Create account"
          onSuccess={redirectAfterAuth}
        />
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Coach or admin?{" "}
        <Link
          href={ROUTES.ADMIN_LOGIN}
          className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Staff portal
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner label="Loading..." />
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
