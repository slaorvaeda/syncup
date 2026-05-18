"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

export default function AppToaster() {
  const { theme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <Toaster
      theme={theme}
      position="top-center"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "font-sans !rounded-xl !border !border-zinc-200 !shadow-lg dark:!border-zinc-800",
        },
      }}
    />
  );
}
