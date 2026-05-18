"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import AppToaster from "@/components/common/AppToaster";

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <NotificationsProvider>
            {children}
            <AppToaster />
          </NotificationsProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
