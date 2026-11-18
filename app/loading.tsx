"use client";

import { useEffect, useRef } from "react";
import animationData from "../public/animations/heartbeat.json";

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: { destroy: () => void } | undefined;
    let isMounted = true;

    const loadAnimation = async () => {
      const lottie = await import("lottie-web");

      if (!isMounted || !containerRef.current) return;

      animation = lottie.default.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
      });
    };

    loadAnimation();

    return () => {
      isMounted = false;
      animation?.destroy();
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div
        ref={containerRef}
        className="h-[300px] w-full max-w-[400px]"
      />
    </div>
  );
}