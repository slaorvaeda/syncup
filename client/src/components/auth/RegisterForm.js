"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  validateRegisterForm,
  validateRegisterField,
} from "@/lib/validation/auth";
import { useFormHandler } from "@/hooks/useFormHandler";
import { FormErrorAlert } from "@/components/common/FormAlert";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";

export const STAFF_REGISTER_ROLES = [
  { value: "coach", label: "Coach — publish feeds" },
  { value: "admin", label: "Admin — publish + manage users" },
];

export default function RegisterForm({
  role = "student",
  roleOptions,
  onSuccess,
}) {
  const { register } = useAuth();
  const options = roleOptions || null;
  const [registerRole, setRegisterRole] = useState(
    options?.[0]?.value || role
  );

  const effectiveRole = options ? registerRole : role;

  const form = useFormHandler({
    initialValues: { name: "", email: "", password: "" },
    validate: (values) =>
      validateRegisterForm({ ...values, role: effectiveRole }),
    validateField: (field, values) =>
      validateRegisterField(field, { ...values, role: effectiveRole }),
    onSubmit: async (values) => {
      return register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: effectiveRole,
      });
    },
    successMessage: "Account created successfully",
    toastSuccess: false,
    onSuccess: (user) => onSuccess?.(user),
  });

  const {
    formRef,
    values,
    submitting,
    formError,
    setFormError,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = form;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormErrorAlert message={formError} />

      {options && (
        <Select
          label="Account type"
          name="role"
          value={registerRole}
          onChange={(e) => {
            setRegisterRole(e.target.value);
            setFormError("");
          }}
          options={options}
        />
      )}

      <Input
        label="Full name"
        name="name"
        value={values.name}
        onChange={handleChange("name")}
        onBlur={handleBlur("name")}
        placeholder={effectiveRole === "admin" ? "Admin User" : "Jane Coach"}
        error={getFieldError("name")}
        required
        autoComplete="name"
        maxLength={100}
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange("email")}
        onBlur={handleBlur("email")}
        placeholder={
          effectiveRole === "admin" ? "admin@syncup.com" : "coach@syncup.com"
        }
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
        placeholder="At least 6 characters"
        error={getFieldError("password")}
        required
        autoComplete="new-password"
        minLength={6}
        maxLength={128}
      />

      <Button type="submit" loading={submitting} className="w-full">
        Create {effectiveRole} account
      </Button>
    </form>
  );
}
