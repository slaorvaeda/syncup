"use client";

import Link from "next/link";
import { createFeed, updateFeed } from "@/lib/api";
import {
  feedToFormValues,
  INITIAL_FEED_FORM,
} from "@/lib/feed-form";
import {
  buildFeedPayload,
  validateFeedField,
  validateFeedForm,
} from "@/lib/validation/feed";
import { useFormHandler } from "@/hooks/useFormHandler";
import {
  FEED_TYPES,
  FEED_STATUS,
  FEED_VISIBILITY,
} from "@/constants";
import { FormErrorAlert } from "@/components/common/FormAlert";
import FormSection from "@/components/common/FormSection";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Textarea from "@/components/common/Textarea";
import { ImageUpload, AttachmentUpload } from "@/components/feed/MediaUpload";

export { INITIAL_FEED_FORM };

export default function FeedForm({
  feedId = null,
  defaultValues = null,
  onSuccess,
  cancelHref,
}) {
  const isEdit = Boolean(feedId);
  const form = useFormHandler({
    initialValues: defaultValues
      ? feedToFormValues(defaultValues)
      : INITIAL_FEED_FORM,
    validate: validateFeedForm,
    validateField: validateFeedField,
    resetOnSuccess: !isEdit,
    successMessage: isEdit
      ? "Post updated successfully"
      : "Feed published successfully",
    onSubmit: async (values) => {
      const payload = buildFeedPayload(values);
      if (isEdit) {
        return updateFeed(feedId, payload);
      }
      return createFeed(payload);
    },
    onSuccess: (res) => {
      onSuccess?.(res?.data);
    },
  });

  const {
    formRef,
    values,
    setValue,
    submitting,
    formError,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = form;

  const publishLabel = isEdit
    ? "Save changes"
    : values.status === "draft"
      ? "Save draft"
      : "Publish to feed";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
      <FormErrorAlert message={formError} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FormSection
            title="Content"
            description="The main text and cover image visitors see on the feed."
          >
            <Input
              label="Title"
              name="title"
              value={values.title}
              onChange={handleChange("title")}
              onBlur={handleBlur("title")}
              placeholder="Weekly check-in reminder"
              error={getFieldError("title")}
              maxLength={200}
            />
            <div>
              <Textarea
                label="Message"
                name="message"
                value={values.message}
                onChange={handleChange("message")}
                onBlur={handleBlur("message")}
                placeholder="Share a coaching tip or announcement..."
                error={getFieldError("message")}
                rows={6}
                required
                maxLength={2000}
              />
              <p className="mt-1.5 text-right text-xs text-zinc-500">
                {values.message.length} / 2000
              </p>
            </div>
          </FormSection>

          <FormSection
            title="Media"
            description="Optional cover image and file attachments (stored on Cloudinary)."
          >
            <div data-field="imageUrl">
              <ImageUpload
                value={values.imageUrl}
                onChange={(url) => setValue("imageUrl", url)}
                error={getFieldError("imageUrl")}
              />
            </div>
            <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800" data-field="attachments">
              <AttachmentUpload
                attachments={values.attachments}
                onChange={(attachments) => setValue("attachments", attachments)}
                error={getFieldError("attachments")}
              />
            </div>
          </FormSection>
        </div>

        <div className="space-y-6">
          <FormSection
            title="Post settings"
            description="Type, visibility, and publishing state."
          >
            <Select
              label="Type"
              name="type"
              value={values.type}
              onChange={handleChange("type")}
              onBlur={handleBlur("type")}
              options={FEED_TYPES}
              error={getFieldError("type")}
            />
            <Select
              label="Status"
              name="status"
              value={values.status}
              onChange={handleChange("status")}
              onBlur={handleBlur("status")}
              options={FEED_STATUS}
              error={getFieldError("status")}
            />
            <Select
              label="Visibility"
              name="visibility"
              value={values.visibility}
              onChange={handleChange("visibility")}
              onBlur={handleBlur("visibility")}
              options={FEED_VISIBILITY}
              error={getFieldError("visibility")}
            />
          </FormSection>

          <FormSection
            title="Audience"
            description="Optional program or cohort targeting."
          >
            <Input
              label="Program ID"
              name="programId"
              value={values.programId}
              onChange={handleChange("programId")}
              onBlur={handleBlur("programId")}
              placeholder="program-101"
              error={getFieldError("programId")}
              maxLength={100}
            />
            <Input
              label="Cohort ID"
              name="cohortId"
              value={values.cohortId}
              onChange={handleChange("cohortId")}
              onBlur={handleBlur("cohortId")}
              placeholder="cohort-a"
              error={getFieldError("cohortId")}
              maxLength={100}
            />
          </FormSection>

          <FormSection
            title="Schedule"
            description="Leave empty to publish immediately (when status is Published)."
          >
            <Input
              label="Publish at"
              type="datetime-local"
              name="scheduledAt"
              value={values.scheduledAt}
              onChange={handleChange("scheduledAt")}
              onBlur={handleBlur("scheduledAt")}
              error={getFieldError("scheduledAt")}
            />
            <Input
              label="Expires at"
              type="datetime-local"
              name="expiresAt"
              value={values.expiresAt}
              onChange={handleChange("expiresAt")}
              onBlur={handleBlur("expiresAt")}
              error={getFieldError("expiresAt")}
            />
          </FormSection>

          <FormSection title="Options">
            <Checkbox
              label="Pin this post to the top of the feed"
              checked={values.isPinned}
              onChange={handleChange("isPinned")}
            />
            <Input
              label="Tags"
              name="tags"
              value={values.tags}
              onChange={handleChange("tags")}
              onBlur={handleBlur("tags")}
              placeholder="nutrition, week-3, mindset"
              error={getFieldError("tags")}
            />
            <p className="text-xs text-zinc-500">
              Comma-separated, up to 20 tags.
            </p>
          </FormSection>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4 dark:border-indigo-900 dark:bg-indigo-950/40 sm:p-5 lg:sticky lg:top-4">
            <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
              Ready to go live?
            </p>
            <p className="mt-1 text-xs text-indigo-800/80 dark:text-indigo-300/80">
              {values.status === "published"
                ? "This post will appear on the public feed."
                : "Drafts are saved but not shown on the home page."}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button type="submit" loading={submitting} className="w-full">
                {publishLabel}
              </Button>
              {cancelHref && (
                <Link
                  href={cancelHref}
                  className="block rounded-lg py-2 text-center text-sm font-medium text-zinc-600 hover:bg-white/60 dark:text-zinc-400"
                >
                  Cancel
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
