"use client";

import { useRef, useState } from "react";
import { useEffect } from "react";
import gsap from "gsap";

interface HoverGlowProps {
  children: React.ReactNode;
  glowColor?: "cyan" | "magenta" | "dual";
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export function HoverGlow({
  children,
  glowColor = "cyan",
  intensity = "medium",
  className = "",
}: HoverGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const glowColors = {
      cyan: "#00FFF7",
      magenta: "#FF00FF",
      dual: "#00FFF7, #FF00FF",
    };

    const intensityValues = {
      low: { blur: 8, spread: 12, lift: -2 },
      medium: { blur: 12, spread: 18, lift: -3 },
      high: { blur: 18, spread: 25, lift: -4 },
    };

    const config = intensityValues[intensity];
    const color = glowColors[glowColor];

    if (isHovered) {
      gsap.to(containerRef.current, {
        y: config.lift,
        boxShadow: `0 0 ${config.blur}px ${color}, 0 0 ${config.spread}px ${color}40`,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(containerRef.current, {
        y: 0,
        boxShadow: "0 0 0px transparent",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isHovered, glowColor, intensity]);

  return (
    <div
      ref={containerRef}
      className={`transition-all ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}
