"use client";

import { useState } from "react";
import type { Video } from "@/types/video";

const R2_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

export function VideoCard({ video }: { video: Video }) {
  const [expanded, setExpanded] = useState(false);
  const posterUrl = `${R2_URL}/${video.posterKey}`;

  return (
    <article className="flex flex-col gap-3">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: video.title,
            description: video.description,
            thumbnailUrl: posterUrl,
            uploadDate: video.publishedAt,
            url: video.instagramUrl,
          }),
        }}
      />

      {expanded ? (
        <InstagramEmbed url={video.instagramUrl} />
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="relative w-full aspect-[9/16] max-w-xs mx-auto rounded-xl overflow-hidden group"
          aria-label={`Play ${video.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl}
            alt={video.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <PlayIcon />
          </span>
        </button>
      )}

      <h2 className="font-semibold text-gray-900 text-sm">{video.title}</h2>
      <p className="text-gray-500 text-sm leading-relaxed">{video.description}</p>
    </article>
  );
}

function InstagramEmbed({ url }: { url: string }) {
  // Inject embed.js only once, lazily, after first click
  if (typeof window !== "undefined" && !(window as Window & { instgrm?: unknown }).instgrm) {
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    document.body.appendChild(s);
  }

  return (
    <blockquote
      className="instagram-media w-full"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
    />
  );
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={48}
      height={48}
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden
    >
      <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.4)" />
      <polygon points="10,8 16,12 10,16" fill="white" />
    </svg>
  );
}
