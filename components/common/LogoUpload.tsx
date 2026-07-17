"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface LogoUploadProps {
  currentLogoUrl?: string | null;
  onUploadSuccess: (url: string) => void;
}

export default function LogoUpload({ currentLogoUrl, onUploadSuccess }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogoUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    // Show local preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await fetch("/api/user/logo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUploadSuccess(data.logoUrl);
      setPreview(data.logoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(currentLogoUrl || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
            <Image
              src={preview}
              alt="Logo preview"
              fill
              className="object-contain"
              unoptimized={!preview.startsWith("/") && !preview.startsWith("http")}
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-2xl flex-shrink-0">
            🖼️
          </div>
        )}

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
              uploading
                ? "bg-slate-200 text-slate-500 cursor-wait"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {uploading ? "⏳ Uploading..." : "📤 Choose Logo"}
          </label>
          <p className="text-xs text-slate-500 mt-1">PNG, JPEG, WebP, SVG (max 2MB)</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {preview && (
        <button
          type="button"
          onClick={() => {
            if (fileInputRef.current) fileInputRef.current.value = "";
            setPreview(null);
            // Optionally call API to delete logo
          }}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Remove logo
        </button>
      )}
    </div>
  );
}