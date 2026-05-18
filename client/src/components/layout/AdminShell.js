"use client";

import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

export default function AdminShell({ children }) {
  return (
    <div className="min-h-screen lg:flex">
      <AdminSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-background">
        <main className="mx-auto w-full max-w-5xl flex-1 px-3 py-5 sm:px-6 sm:py-8">
          <AdminAuthGuard>{children}</AdminAuthGuard>
        </main>
      </div>
    </div>
  );
}
