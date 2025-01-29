"use client";
import Image from "next/image";
import { useState } from "react";

export function ArticleImage({ src, alt }: { src: string | null; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full aspect-video relative bg-gray-100 flex items-center justify-center">
        <div className="text-gray-400">No image available</div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-lg bg-gray-100">
      <Image
  src={src}
  alt={alt}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
  className="object-cover"
  onError={() => setHasError(true)}
/>
    </div>
  );
}