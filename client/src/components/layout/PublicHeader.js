"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-6">
        <Link href={ROUTES.HOME} className="flex items-center gap-2.5">
          <Logo size="sm" />
          <span className="text-base font-semibold tracking-tight sm:text-lg">
            SyncUp
          </span>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
