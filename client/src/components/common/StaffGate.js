"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isStaff } from "@/lib/roles";
import { buildAdminLoginUrl } from "@/lib/routes";
import Alert from "@/components/common/Alert";
import Spinner from "@/components/common/Spinner";

export default function StaffGate({ children }) {
  const pathname = usePathname();
  const { user, loading, isAuthenticated } = useAuth();
  const loginHref = buildAdminLoginUrl(pathname);

  if (loading) {
    return <Spinner label="Loading..." />;
  }

  if (!isAuthenticated || !isStaff(user)) {
    return (
      <Alert variant="info">
        <p className="mb-3">This page is for logged-in coaches and admins only.</p>
        <Link
          href={loginHref}
          className="font-medium text-indigo-600 underline dark:text-indigo-400"
        >
          Go to admin login
        </Link>
      </Alert>
    );
  }

  return children;
}
