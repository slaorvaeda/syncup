"use client";

import { useAuth } from "@/contexts/AuthContext";
import { validateLoginForm, validateLoginField } from "@/lib/validation/auth";
import { useFormHandler } from "@/hooks/useFormHandler";
import { FormErrorAlert } from "@/components/common/FormAlert";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

export default function LoginForm({
  onSuccess,
  defaultRole,
  allowedRoles,
}) {
  const { login, logout } = useAuth();

  const form = useFormHandler({
    initialValues: { email: "", password: "" },
    validate: validateLoginForm,
    validateField: validateLoginField,
    onSubmit: async (values) => {
      const user = await login({
        email: values.email.trim(),
        password: values.password,
      });

      if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
        logout();
        throw new Error(
          `Use a ${allowedRoles.join(" or ")} account. You signed in as ${user.role}.`
        );
      }

      if (
        defaultRole &&
        !allowedRoles?.length &&
        user.role !== defaultRole &&
        user.role !== "admin"
      ) {
        logout();
        throw new Error(
          `This page requires a ${defaultRole} account. You signed in as ${user.role}.`
        );
      }

      return user;
    },
    successMessage: "Signed in successfully",
    toastSuccess: false,
    onSuccess: (user) => onSuccess?.(user),
  });

  const {
    formRef,
    values,
    submitting,
    formError,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = form;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormErrorAlert message={formError} />

      <Input
        label="Email"
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange("email")}
        onBlur={handleBlur("email")}
        placeholder="admin@syncup.com"
        error={getFieldError("email")}
        required
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange("password")}
        onBlur={handleBlur("password")}
        placeholder="••••••••"
        error={getFieldError("password")}
        required
        autoComplete="current-password"
      />

      <Button type="submit" loading={submitting} className="w-full">
        Sign in
      </Button>
    </form>
  );
}
