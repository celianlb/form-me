"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useRef, useCallback } from "react";
import { createNoise3D } from "simplex-noise";

interface WavyBackgroundProps {
  className?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
}

export default function WavyBackground({
  className,
  colors,
  waveWidth,
  backgroundFill = "white",
  blur = 10,
  speed = "slow",
  waveOpacity = 0.4,
}: WavyBackgroundProps) {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationId = useRef<number>(0);
  const wRef = useRef(0);
  const hRef = useRef(0);
  const ntRef = useRef(0);

  const getSpeed = useCallback(() => {
    switch (speed) {
      case "slow":
        return 0.0005;
      case "fast":
        return 0.002;
      default:
        return 0.0005;
    }
  }, [speed]);

  const waveColors = colors ?? [
    "#3B82F6", // blue-500
    "#1D4ED8", // blue-700
    "#60A5FA", // blue-400
    "#2563EB", // blue-600
    "#93C5FD", // blue-300
  ];

  const drawWave = useCallback(
    (ctx: CanvasRenderingContext2D, n: number) => {
      ntRef.current += getSpeed();
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = 0; x < wRef.current; x += 5) {
          const y = noise(x / 800, 0.3 * i, ntRef.current) * 80;
          ctx.lineTo(x, y + hRef.current * 0.85);
        }
        ctx.stroke();
        ctx.closePath();
      }
    },
    [getSpeed, noise, waveColors, waveWidth]
  );

  const render = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, wRef.current, hRef.current);
      drawWave(ctx, 5);
      animationId.current = requestAnimationFrame(() => render(ctx));
    },
    [backgroundFill, drawWave, waveOpacity]
  );

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    wRef.current = rect.width;
    hRef.current = rect.height;
    canvas.width = wRef.current;
    canvas.height = hRef.current;

    ctx.filter = `blur(${blur}px)`;
    ntRef.current = 0;

    render(ctx);
  }, [blur, render]);

  useEffect(() => {
    init();

    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      wRef.current = rect.width;
      hRef.current = rect.height;
      canvas.width = wRef.current;
      canvas.height = hRef.current;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.filter = `blur(${blur}px)`;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [blur, init]);

  // Check for Safari to handle reduced motion
  const isSafari =
    typeof window !== "undefined" &&
    navigator.userAgent.includes("Safari") &&
    !navigator.userAgent.includes("Chrome");

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden",
        isSafari ? "opacity-70" : "",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{
          filter: `blur(${blur}px)`,
        }}
      />
      {/* Gradient overlay pour fade en bas */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />
    </div>
  );
}
