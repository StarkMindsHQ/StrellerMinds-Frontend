"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
    document.documentElement.dataset.theme = saved || "light";
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.dataset.theme = next;
  };

  return (
    <button className={styles.toggleButton} onClick={toggleTheme}>
      {theme === "light" ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}