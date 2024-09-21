"use client";

import { useState, useEffect }  from "react";
import { useTheme } from "next-themes";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensures the theme has mounted on the client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid SSR mismatches
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={handleToggle}
      className="relative p-2 border rounded focus:outline-none focus:ring-2 focus:ring-offset-2"
    >
      {isDark ? (
        <span className="block">🌙 Dark Mode</span>
      ) : (
        <span className="block">☀️ Light Mode</span>
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
