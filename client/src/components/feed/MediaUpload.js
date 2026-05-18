"use client";

import { useRef, useState } from "react";
import { uploadFeedFile, uploadFeedImage } from "@/lib/api";
import Alert from "@/components/common/Alert";
import { toast } from "@/lib/toast";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";

function UploadZone({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900/30 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20"
    >
      {children}
    </button>
  );
}

export function ImageUpload({
  value,
  onChange,
  label = "Cover image",
  error: externalError,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPEG, PNG, WebP, GIF)");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const res = await uploadFeedImage(file);
      onChange(res.data.url);
    } catch (err) {
      const message = err.message || "Image upload failed";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      {(error || externalError) && (
        <Alert variant="error">{error || externalError}</Alert>
      )}

      {value ? (
        <div className="space-y-3">
          <img
            src={value}
            alt="Cover preview"
            className="max-h-56 w-full rounded-xl border border-zinc-200 object-cover dark:border-zinc-700"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={uploading}
              onClick={() => inputRef.current?.click()}
            >
              Replace image
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(null)}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <UploadZone
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Spinner label="Uploading to Cloudinary..." />
          ) : (
            <>
              <span className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Upload cover image
              </span>
              <span className="mt-1 text-xs text-zinc-500">
                JPEG, PNG, WebP or GIF
              </span>
            </>
          )}
        </UploadZone>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

export function AttachmentUpload({
  attachments,
  onChange,
  error: externalError,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (attachments.length >= 5) {
      setError("Maximum 5 attachments");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const res = await uploadFeedFile(file);
      onChange([
        ...attachments,
        {
          url: res.data.url,
          name: res.data.name || file.name,
          type: res.data.type || file.type,
        },
      ]);
    } catch (err) {
      const message = err.message || "Upload failed";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (index) => {
    onChange(attachments.filter((_, i) => i !== index));
  };

  const atLimit = attachments.length >= 5;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Attachments
        </span>
        <span className="text-xs text-zinc-500">{attachments.length} / 5</span>
      </div>
      <p className="text-xs text-zinc-500">Images or PDF files</p>

      {(error || externalError) && (
        <Alert variant="error">{error || externalError}</Alert>
      )}

      {attachments.length > 0 && (
        <ul className="space-y-2">
          {attachments.map((att, i) => (
            <li
              key={`${att.url}-${i}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900/50"
            >
              <a
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 truncate font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {att.name || att.url}
              </a>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(i)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      <UploadZone
        onClick={() => inputRef.current?.click()}
        disabled={uploading || atLimit}
      >
        {uploading ? (
          <Spinner label="Uploading..." />
        ) : (
          <>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {atLimit ? "Maximum attachments reached" : "Add attachment"}
            </span>
          </>
        )}
      </UploadZone>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
