"use client";

import {
  validateCommentForm,
  validateCommentField,
} from "@/lib/validation/comment";
import { useFormHandler } from "@/hooks/useFormHandler";
import { FormErrorAlert } from "@/components/common/FormAlert";
import Button from "@/components/common/Button";
import Textarea from "@/components/common/Textarea";

export default function CommentForm({ onSubmit, submitting: externalSubmitting }) {
  const form = useFormHandler({
    initialValues: { text: "" },
    validate: validateCommentForm,
    validateField: validateCommentField,
    resetOnSuccess: true,
    onSubmit: async (values) => {
      await onSubmit(values.text.trim());
      return "Comment posted";
    },
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

  const isLoading = submitting || externalSubmitting;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mt-3 space-y-2"
      noValidate
    >
      <FormErrorAlert message={formError} />
      <Textarea
        name="text"
        value={values.text}
        onChange={handleChange("text")}
        onBlur={handleBlur("text")}
        placeholder="Add a comment..."
        error={getFieldError("text")}
        rows={2}
        maxLength={1000}
      />
      <p className="text-xs text-zinc-500">{values.text.length}/1000</p>
      <Button type="submit" size="sm" loading={isLoading} disabled={isLoading}>
        Post comment
      </Button>
    </form>
  );
}
