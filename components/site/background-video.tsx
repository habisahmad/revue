import * as React from "react";
import { cn } from "@/lib/utils";

type BackgroundVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
  poster?: string;
  /** Optional dark overlay opacity 0–1. Defaults to 0.55 for legibility. */
  overlay?: number;
};

export function BackgroundVideo({
  src,
  poster,
  overlay = 0.55,
  className,
  ...props
}: BackgroundVideoProps) {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
        className={cn(
          "absolute inset-0 w-full h-full object-cover z-0",
          className
        )}
        {...props}
      >
        <source src={src} />
      </video>
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: `rgba(0,0,0,${overlay})` }}
      />
    </>
  );
}
