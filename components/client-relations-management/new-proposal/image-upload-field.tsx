"use client";

import * as React from "react";
import { Image as ImageIcon, Upload, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  /** Data URL or remote URL of the current image (empty = no image). */
  value: string;
  onChange: (dataUrl: string) => void;
  /** Optional aspect ratio for the preview (e.g. "16/9"). */
  aspect?: string;
  /** Visual variant. `cover` fills the area; `avatar` is a round avatar uploader. */
  variant?: "cover" | "avatar";
  className?: string;
  /** Accept attribute (defaults to common image types). */
  accept?: string;
  /** Max file size in bytes (default 5MB). */
  maxBytes?: number;
}

/**
 * Drag-and-drop / click-to-browse image uploader. Reads the chosen file
 * as a data URL and emits it via {@link onChange}. The data URL is
 * stored directly so the proposal draft is self-contained and survives
 * a localStorage round-trip without referencing files that may be gone.
 */
export function ImageUploadField({
  value,
  onChange,
  aspect = "16/9",
  variant = "cover",
  className,
  accept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
  maxBytes = 5 * 1024 * 1024,
}: ImageUploadFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const consumeFile = (file: File | null) => {
    if (!file) return;
    if (file.size > maxBytes) {
      setError(`File too large (max ${Math.round(maxBytes / 1024 / 1024)}MB)`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setError(null);
        onChange(result);
      }
    };
    reader.onerror = () => setError("Failed to read file");
    reader.readAsDataURL(file);
  };

  const openPicker = () => inputRef.current?.click();
  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  if (variant === "avatar") {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <button
          type="button"
          onClick={openPicker}
          className="relative size-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors outline-none">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Avatar"
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon
              className="size-6 text-muted-foreground"
              strokeWidth={1.8}
            />
          )}
        </button>
        <button
          type="button"
          onClick={openPicker}
          className="text-xs font-bold text-primary hover:underline">
          {value ? "Change Image" : "Upload Image"}
        </button>
        {error ? (
          <span className="text-[10px] font-bold text-destructive">{error}</span>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => consumeFile(e.target.files?.[0] ?? null)}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          consumeFile(e.dataTransfer.files?.[0] ?? null);
        }}
        style={{ aspectRatio: aspect }}
        className={cn(
          "relative w-full rounded-[10px] overflow-hidden bg-muted border-2 border-dashed transition-all cursor-pointer outline-none",
          dragging
            ? "border-primary bg-primary/5"
            : value
              ? "border-transparent"
              : "border-border hover:border-primary/40 hover:bg-muted/70",
        )}>
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker();
                }}
                aria-label="Change image"
                className="size-7 rounded-[6px] bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors outline-none shadow">
                <Eye className="size-3.5" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={clearImage}
                aria-label="Remove image"
                className="size-7 rounded-[6px] bg-destructive/95 backdrop-blur-sm flex items-center justify-center text-white hover:bg-destructive transition-colors outline-none shadow">
                <X className="size-3.5" strokeWidth={2.4} />
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="size-10 rounded-[8px] bg-background flex items-center justify-center shadow-sm">
              <Upload
                className={cn(
                  "size-4",
                  dragging ? "text-primary" : "text-muted-foreground",
                )}
                strokeWidth={2.2}
              />
            </div>
            <span className="text-xs font-bold text-foreground">
              {dragging ? "Drop image here" : "Click or drag to upload"}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">
              PNG, JPG, WEBP, SVG (max {Math.round(maxBytes / 1024 / 1024)}MB)
            </span>
          </div>
        )}
      </div>
      {error ? (
        <span className="text-[10px] font-bold text-destructive">{error}</span>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => consumeFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
