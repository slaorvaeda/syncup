"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isStaff } from "@/lib/roles";
import {
  canAccessPath,
  getStaffAuthRedirect,
  isAdminLoginPath,
  isInternalPath,
} from "@/lib/routes";
import Spinner from "@/components/common/Spinner";

function AdminAuthGuardInner({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, isAuthenticated } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) {
      setReady(false);
      return;
    }

    const redirect = getStaffAuthRedirect(pathname, {
      loading,
      isAuthenticated,
      user,
    });

    if (redirect) {
      setReady(false);
      if (redirect !== pathname) {
        router.replace(redirect);
      }
      return;
    }

    if (isAdminLoginPath(pathname) && isAuthenticated && isStaff(user)) {
      const returnTo = searchParams.get("redirect");
      if (
        returnTo &&
        isInternalPath(returnTo) &&
        canAccessPath(returnTo, user) &&
        returnTo !== pathname
      ) {
        setReady(false);
        router.replace(returnTo);
        return;
      }
    }

    setReady(true);
  }, [loading, pathname, isAuthenticated, user, searchParams, router]);

  if (loading || !ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading..." />
      </div>
    );
  }

  return children;
}

export default function AdminAuthGuard({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner label="Loading..." />
        </div>
      }
    >
      <AdminAuthGuardInner>{children}</AdminAuthGuardInner>
    </Suspense>
  );
}
