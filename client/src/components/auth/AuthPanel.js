"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm, { STAFF_REGISTER_ROLES } from "@/components/auth/RegisterForm";

const TABS = [
  { id: "login", label: "Sign in" },
  { id: "register", label: "Sign up" },
];

export default function AuthPanel({
  role = "student",
  allowedRoles,
  roleOptions,
  loginTitle = "Sign in",
  registerTitle = "Create account",
  onSuccess,
}) {
  const [tab, setTab] = useState("login");

  return (
    <div className="w-full">
      <div
        className="mb-6 flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900"
        role="tablist"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              tab === item.id
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {tab === "login" ? loginTitle : registerTitle}
      </h2>

      {tab === "login" ? (
        <LoginForm
          defaultRole={role}
          allowedRoles={allowedRoles}
          onSuccess={onSuccess}
        />
      ) : (
        <RegisterForm
          role={role}
          roleOptions={roleOptions}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}

export { STAFF_REGISTER_ROLES };
