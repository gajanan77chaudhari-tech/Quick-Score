
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1800); // Start fading out before the 2-second timeout on the main page

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-300 ease-in-out p-4",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden animate-rotate-clockwise">
        <Image
          src="https://uploads.onecompiler.io/42zwkdaww/43tg7azu5/Screenshot%202025-08-12%20173713-photoaidcom-cropped.png"
          alt="App Logo"
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>
    </div>
  );
}
