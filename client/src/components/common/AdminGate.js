"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { isStaff } from "@/lib/roles";
import { ROUTES } from "@/lib/routes";
import Alert from "@/components/common/Alert";
import Spinner from "@/components/common/Spinner";
import Button from "@/components/common/Button";

export default function AdminGate({ children }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Spinner label="Loading..." />;
  }

  if (!isAuthenticated || !isStaff(user)) {
    return (
      <Alert variant="info">
        <p className="mb-3">
          Sign in with an <strong>admin</strong> account to manage users.
        </p>
        <Link href={ROUTES.ADMIN_LOGIN}>
          <Button size="sm">Go to admin login</Button>
        </Link>
      </Alert>
    );
  }

  if (user.role !== "admin") {
    return (
      <Alert variant="warning">
        <p className="mb-2 font-medium">
          You are signed in as <span className="capitalize">{user.role}</span> (
          {user.email})
        </p>
        <p className="mb-4 text-sm opacity-90">
          The users list is only for accounts with the <strong>admin</strong> role.
          Coaches can publish feeds from the Publish page — they cannot view all
          users.
        </p>
        <Link href={ROUTES.ADMIN_LOGIN}>
          <Button variant="secondary" size="sm">
            Back to Publish
          </Button>
        </Link>
      </Alert>
    );
  }

  return children;
}
