"use client";

import * as React from "react";
import { Upload, X, FileText, Image as ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";

interface FileUploadProps {
  label?: string;
  accept?: string;
  hint?: string;
  value?: string | null;
  onChange?: (file: File | null) => void;
  className?: string;
}

export function FileUpload({ label, accept = "image/*,.pdf", hint, value, onChange, className }: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadedName, setUploadedName] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<string | null>(value ?? null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setUploadedName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    onChange?.(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedName(null);
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isImage = preview && (preview.startsWith("data:image") || /\.(png|jpg|jpeg|gif|webp)$/i.test(preview));

  return (
    <div className={cn("flex flex-col gap-[6px] w-full items-start", className)}>
      {label && (
        <Typography className="text-foreground text-md font-bold leading-[22.4px] font-janna">
          {label}
        </Typography>
      )}


      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative w-full rounded-[12px] border border-dashed transition-all cursor-pointer bg-background",
          "flex flex-col items-center justify-center gap-4 py-7 px-4 text-center min-h-[137px]",
          isDragging
            ? "border-primary bg-primary/5"
            : uploadedName
            ? "border-success/50 bg-success/5"
            : "border-muted-foreground/30 hover:bg-muted/50"
        )}

      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />

        {uploadedName ? (
          <>
            {isImage ? (
              <div className="relative size-[56px] rounded-[8px] overflow-hidden ring-2 ring-success/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview!} alt="preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="size-[48px] bg-secondary rounded-[10px] flex items-center justify-center">
                <FileText className="size-[22px] text-muted-foreground" />
              </div>
            )}

            <div className="flex flex-col items-center gap-[2px]">
              <Typography className="text-sm font-bold text-foreground leading-[16px] max-w-[200px] truncate">
                {uploadedName}
              </Typography>
              <div className="flex items-center gap-[4px]">
                <Check className="size-[10px] text-success" />
                <Typography className="text-xs font-bold text-success">Uploaded</Typography>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-[8px] right-[8px] size-[20px] bg-secondary hover:bg-secondary/80 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="size-[10px] text-foreground" />
            </button>

          </>
        ) : (
          <>
            <Upload className={cn("size-[24px]", isDragging ? "text-primary" : "text-muted-foreground")} strokeWidth={2} />
            <div className="flex flex-col gap-[2px] items-center">
              <Typography className="text-md font-bold text-foreground font-janna">
                {isDragging ? "Drop file here" : "Click to upload or drag and drop"}
              </Typography>
              {hint && (
                <Typography className="text-sm font-bold text-muted-foreground font-janna">{hint}</Typography>
              )}
            </div>
          </>

        )}
      </div>
    </div>
  );
}
