"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { upload } from "@imagekit/next";
import {
  ImagePlus,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

interface ImageGalleryInputProps {
  gallery: string[];
  setGallery: (images: string[]) => void;
  maxImages?: number;
}

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageGalleryInput({
  gallery,
  setGallery,
  maxImages = 10,
}: ImageGalleryInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFiles(files: FileList | null) {
    if (!files?.length || uploading) return;

    const selectedFiles = Array.from(files);
    const remainingSlots = maxImages - gallery.length;

    if (remainingSlots <= 0) {
      toast.error(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    if (selectedFiles.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s).`);
      return;
    }

    for (const file of selectedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: use JPG, PNG or WebP.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: maximum file size is 8MB.`);
        return;
      }
    }

    setUploading(true);
    setProgress(0);

    try {
      const uploadedUrls: string[] = [];

      for (let index = 0; index < selectedFiles.length; index++) {
        const file = selectedFiles[index];

        const authResponse = await fetch("/api/imagekit-auth", {
          method: "GET",
          cache: "no-store",
        });

        if (!authResponse.ok) {
          const error = await authResponse.json().catch(() => null);
          throw new Error(error?.error || "Could not authorize image upload.");
        }

        const auth = await authResponse.json();

        const result = await upload({
          file,
          fileName: file.name,
          token: auth.token,
          signature: auth.signature,
          expire: auth.expire,
          publicKey: auth.publicKey,
          folder: "/worker-profiles/gallery",
          useUniqueFileName: true,
          onProgress: (event) => {
            const currentFileProgress = event.total
              ? event.loaded / event.total
              : 0;

            const overallProgress =
              ((index + currentFileProgress) / selectedFiles.length) * 100;

            setProgress(Math.round(overallProgress));
          },
        });

        if (!result.url) {
          throw new Error(`ImageKit did not return a URL for ${file.name}.`);
        }

        uploadedUrls.push(result.url);
      }

      setGallery([...gallery, ...uploadedUrls]);
      toast.success(
        `${uploadedUrls.length} image(s) uploaded successfully.`
      );
    } catch (error) {
      console.error("Gallery upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setUploading(false);
      setProgress(0);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeImage(index: number) {
    setGallery(gallery.filter((_, imageIndex) => imageIndex !== index));
  }

  function moveImage(index: number, direction: "left" | "right") {
    const newIndex = direction === "left" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= gallery.length) return;

    const updatedGallery = [...gallery];
    [updatedGallery[index], updatedGallery[newIndex]] = [
      updatedGallery[newIndex],
      updatedGallery[index],
    ];

    setGallery(updatedGallery);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#f0ebe0]">
            Portfolio gallery
          </h3>
          <p className="mt-1 text-xs text-[#f0ebe0]/50">
            Showcase your work with high-quality professional photos.
          </p>
        </div>

        <span className="text-xs text-[#f0ebe0]/50">
          {gallery.length}/{maxImages} images
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {gallery.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-[#f0ebe0]/10 bg-[#f0ebe0]/5"
          >
            <Image
              src={image}
              alt={`Portfolio image ${index + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover"
            />

            {index === 0 && (
              <span className="absolute left-2 top-2 rounded-md bg-[#b8924a] px-2 py-1 text-[10px] font-semibold text-[#050403]">
                COVER
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-2 pt-8 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveImage(index, "left")}
                  disabled={index === 0}
                  aria-label="Move image left"
                  className="rounded-md bg-black/60 p-1.5 text-white disabled:opacity-30"
                >
                  <ChevronLeft size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => moveImage(index, "right")}
                  disabled={index === gallery.length - 1}
                  aria-label="Move image right"
                  className="rounded-md bg-black/60 p-1.5 text-white disabled:opacity-30"
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeImage(index)}
                aria-label="Remove image"
                className="rounded-md bg-red-500/90 p-1.5 text-white"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        ))}

        {gallery.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#b8924a]/40 bg-[#b8924a]/5 text-[#f0ebe0]/60 transition hover:border-[#b8924a] hover:bg-[#b8924a]/10 hover:text-[#f0ebe0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="animate-spin text-[#b8924a]" size={25} />
            ) : (
              <ImagePlus size={25} className="text-[#b8924a]" />
            )}

            <span className="text-xs font-medium">
              {uploading ? `${progress}%` : "Add photos"}
            </span>
          </button>
        )}
      </div>

      {uploading && (
        <div className="h-1.5 overflow-hidden rounded-full bg-[#f0ebe0]/10">
          <div
            className="h-full rounded-full bg-[#b8924a] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />

      <p className="text-xs leading-relaxed text-[#f0ebe0]/40">
        JPG, PNG or WebP. Maximum 8MB per image. Your first image will be
        displayed as the gallery cover. You can reorder images at any time.
      </p>
    </div>
  );
}