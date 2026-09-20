"use client";

import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme, resolvedTheme } = useTheme();



  return (
    <div className="min-h-screen w-full">
      <div className="bg-card p-20 border border-border flex items-center gap-4">
              <button className="border-none px-4 py-1.5 border-primary bg-primary" onClick={()=> setTheme("dark")}>
        dark
      </button>
            <button className="border-border bg-secondary px-4 py-1.5" onClick={()=> setTheme("light")}>
        light
      </button>
      </div>
    </div>
  );
}