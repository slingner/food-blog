"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { uploadMedia } from "@/lib/actions/media-actions";

type Props = {
  onUpload: (url: string) => void;
  accept?: string;
  className?: string;
};

export function MediaUploader({
  onUpload,
  accept = "image/*",
  className,
}: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setPreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = await uploadMedia(formData);
        if (result.url) {
          onUpload(result.url);
        }
      } catch {
        console.error("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`relative ${className ?? ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragging
            ? "border-[var(--admin-accent)] bg-[var(--admin-accent)]/5"
            : "border-[var(--admin-border-subtle)] hover:border-[var(--admin-text-muted)] bg-transparent"
        }`}
      >
        {uploading ? (
          <>
            {preview && (
              <img
                src={preview}
                alt=""
                className="w-16 h-16 rounded-lg object-cover opacity-50"
              />
            )}
            <Loader2 className="w-5 h-5 text-[var(--admin-accent)] animate-spin" />
            <span className="text-sm text-[var(--admin-text-muted)]">
              Uploading...
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--admin-surface-raised)]">
              <Upload className="w-5 h-5 text-[var(--admin-text-muted)]" />
            </div>
            <div className="text-center">
              <p className="text-sm text-[var(--admin-text-secondary)]">
                <span className="text-[var(--admin-accent)] font-medium">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-[var(--admin-text-muted)] mt-1">
                PNG, JPG, WebP up to 10MB
              </p>
            </div>
          </>
        )}
      </button>
    </div>
  );
}

export function ImagePreview({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative group rounded-lg overflow-hidden border border-[var(--admin-border)]">
      <img src={url} alt="" className="w-full h-40 object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
