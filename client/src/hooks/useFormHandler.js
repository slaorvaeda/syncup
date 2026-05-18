"use client";

import { useCallback, useRef, useState } from "react";
import {
  getApiErrorMessage,
  hasErrors,
  mapApiFieldErrors,
  scrollToFirstError,
} from "@/lib/validation/utils";
import { toast } from "@/lib/toast";

export function useFormHandler({
  initialValues,
  validate,
  validateField,
  onSubmit,
  onSuccess,
  resetOnSuccess = false,
  successMessage,
  toastSuccess = true,
  toastError = true,
}) {
  const formRef = useRef(null);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const clearFieldError = useCallback((field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setFormError("");
    setFormSuccess("");
  }, []);

  const setValue = useCallback(
    (field, value) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      clearFieldError(field);
    },
    [clearFieldError]
  );

  const handleChange = useCallback(
    (field) => (e) => {
      const value =
        e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
      setValue(field, value);
    },
    [setValue]
  );

  const handleBlur = useCallback(
    (field) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      if (!validateField) return;

      const fieldError = validateField(field, values);
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldError) next[field] = fieldError;
        else delete next[field];
        return next;
      });
    },
    [validateField, values]
  );

  const runValidate = useCallback(() => {
    const nextErrors = validate(values) || {};
    setErrors(nextErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    return nextErrors;
  }, [validate, values]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      setFormError("");
      setFormSuccess("");

      const validationErrors = runValidate();
      if (hasErrors(validationErrors)) {
        const validationMessage = "Please fix the errors below before submitting.";
        setFormError(validationMessage);
        if (toastError) toast.error(validationMessage);
        scrollToFirstError(validationErrors, formRef);
        return;
      }

      setSubmitting(true);
      try {
        const result = await onSubmit(values);
        if (resetOnSuccess) {
          setValues(initialValues);
          setTouched({});
          setErrors({});
        }
        const successText =
          successMessage ||
          (typeof result === "string" ? result : result?.message) ||
          "";
        setFormSuccess(successText);
        if (toastSuccess && successText) {
          toast.success(successText);
        }
        onSuccess?.(result);
      } catch (err) {
        const apiFieldErrors = mapApiFieldErrors(err?.errors);
        if (hasErrors(apiFieldErrors)) {
          setErrors((prev) => ({ ...prev, ...apiFieldErrors }));
          scrollToFirstError(apiFieldErrors, formRef);
        }
        const message = getApiErrorMessage(err, "Submission failed");
        const displayMessage = apiFieldErrors._form || message;
        setFormError(displayMessage);
        if (toastError) toast.error(displayMessage);
      } finally {
        setSubmitting(false);
      }
    },
    [
      runValidate,
      onSubmit,
      resetOnSuccess,
      initialValues,
      onSuccess,
      successMessage,
      toastSuccess,
      toastError,
    ]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setFormError("");
    setFormSuccess("");
  }, [initialValues]);

  const getFieldError = useCallback(
    (field) => errors[field] || "",
    [errors]
  );

  return {
    formRef,
    values,
    setValues,
    setValue,
    errors,
    setErrors,
    touched,
    submitting,
    formError,
    formSuccess,
    setFormSuccess,
    setFormError,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    getFieldError,
    runValidate,
  };
}
