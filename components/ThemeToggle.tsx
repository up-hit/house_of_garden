"use client";

import { useEffect, useState } from "react";
import { THEME_KEY } from "@/lib/theme-script";
import { IconMoon, IconSun } from "./Icons";

type Theme = "light" | "dark";

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function apply(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  if (animate) {
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 450);
  }
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
}

/** Light/dark switch. The choice is saved in localStorage; without a saved choice the system setting is followed. */
export function ThemeToggle() {
  // null until mounted, so server and first client render match.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (readStored()) return; // an explicit choice wins over the system setting
      const next: Theme = e.matches ? "dark" : "light";
      apply(next, true);
      setTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = (theme ?? (document.documentElement.getAttribute("data-theme") as Theme)) === "dark" ? "light" : "dark";
    apply(next, true);
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private mode etc.: the choice just won't persist */
    }
  };

  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      onClick={toggle}
      aria-label="Dark mode"
      aria-pressed={theme === null ? undefined : theme === "dark"}
      title="Toggle light / dark mode"
    >
      <IconSun className="theme-icon theme-icon-sun" />
      <IconMoon className="theme-icon theme-icon-moon" />
    </button>
  );
}
