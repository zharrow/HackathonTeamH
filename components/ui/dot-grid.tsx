"use client";

import { useId } from "react";

interface DotGridProps {
  dotSize?: number;
  dotColor?: string;
  backgroundColor?: string;
  gap?: number;
  className?: string;
  fade?: boolean;
}

export function DotGrid({
  dotSize = 1,
  dotColor = "#666",
  backgroundColor = "transparent",
  gap = 15,
  className = "",
  fade = true,
}: DotGridProps) {
  const patternId = useId();
  const maskId = useId();

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{ backgroundColor }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={gap / 2} cy={gap / 2} r={dotSize} fill={dotColor} />
          </pattern>
          {fade && (
            <radialGradient id={maskId}>
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </radialGradient>
          )}
        </defs>
        {fade ? (
          <>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            <rect
              width="100%"
              height="100%"
              fill={`url(#${maskId})`}
              style={
                {
                  mixBlendMode: "destination-out",
                } as unknown as React.CSSProperties
              }
            />
          </>
        ) : (
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        )}
      </svg>
    </div>
  );
}
