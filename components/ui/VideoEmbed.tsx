"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * YouTube embed using a click-to-play facade.
 *
 * The iframe is only mounted once the viewer asks for it, so a page carrying
 * this does not pay for YouTube's player scripts on first load, and nothing is
 * requested from Google until there is intent. The wrapper reserves the 16:9
 * box up front, so swapping the poster for the iframe shifts no layout.
 */
export function VideoEmbed({
  videoId,
  title,
  className,
  /** Poster is decorative when a caption already names the video. */
  posterAlt,
}: {
  videoId: string;
  title: string;
  className?: string;
  posterAlt?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={cn(
        "relative isolate aspect-video w-full overflow-hidden rounded-brand bg-brand-ink/80",
        className,
      )}
    >
      {playing ? (
        <iframe
          // nocookie host, and autoplay because the click was the intent.
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            alt={posterAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.03]"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-brand-ink/60 via-brand-ink/10 to-transparent"
          />
          {/* 56px target, comfortably above the 44px minimum. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-cream/95 text-brand-green shadow-lg transition-transform duration-300 ease-brand group-hover:scale-110"
          >
            <Play className="ml-0.5 h-5 w-5 fill-current" strokeWidth={0} />
          </span>
        </button>
      )}
    </div>
  );
}
