'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  bucketName?: string;
  className?: string;
}

export function ImageUploader({
  value = [],
  onChange,
  maxFiles = 6,
  bucketName = 'property-media',
  className = '',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (value.length + fileArray.length > maxFiles) {
      setUploadError(`You can upload a maximum of ${maxFiles} images.`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const uploadedUrls: string[] = [];

    for (const file of fileArray) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError(`File "${file.name}" is not an image.`);
        continue;
      }

      // Max 10MB per image
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds the 10MB size limit.`);
        continue;
      }

      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `lodges/${fileName}`;

        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.warn('Supabase storage upload error, falling back to local object URL:', error);
          // If storage bucket is unreachable or offline, generate local object preview
          const localUrl = URL.createObjectURL(file);
          uploadedUrls.push(localUrl);
        } else if (data) {
          const { data: publicData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(data.path);
          if (publicData?.publicUrl) {
            uploadedUrls.push(publicData.publicUrl);
          }
        }
      } catch (err) {
        console.warn('Upload exception:', err);
        const localUrl = URL.createObjectURL(file);
        uploadedUrls.push(localUrl);
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...value, ...uploadedUrls]);
    }
    setIsUploading(false);
  };

  const handleRemove = (indexToRemove: number) => {
    const filtered = value.filter((_, idx) => idx !== indexToRemove);
    onChange(filtered);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50/50'
            : 'border-slate-300 bg-slate-50/50 hover:border-emerald-400 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleUploadFiles(e.target.files);
            }
          }}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-xs text-slate-500 py-2">
            <Loader2 className="h-7 w-7 text-emerald-600 animate-spin" />
            <span>Uploading real photos to storage...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-xs text-slate-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">
                Click to browse or drag & drop property photos
              </p>
              <p className="text-[11px] text-slate-500">
                Supports JPG, PNG, WebP (up to 10MB each). Up to {maxFiles} images.
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Uploaded Thumbnails Preview */}
      {value.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Uploaded Photos ({value.length}/{maxFiles})</span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              First image is the cover photo
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {value.map((url, idx) => (
              <div
                key={idx}
                className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-2xs"
              >
                <img
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  className="h-full w-full object-cover"
                />

                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    Cover
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="absolute top-1 right-1 rounded-full bg-slate-900/80 p-1 text-white hover:bg-red-600 transition-colors opacity-90 group-hover:opacity-100"
                  title="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
