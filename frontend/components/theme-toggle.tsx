"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

// Frappe stores its color scheme under this localStorage key.
// Change to match your Frappe version if different.
const FRAPPE_THEME_KEY = "frappe_color_scheme";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();

    // On mount: read Frappe's stored preference and apply it
    useEffect(() => {
        const stored = localStorage.getItem(FRAPPE_THEME_KEY);
        if (stored === "dark" || stored === "light") {
            setTheme(stored);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep Frappe's localStorage key in sync whenever theme changes
    useEffect(() => {
        if (resolvedTheme === "dark" || resolvedTheme === "light") {
            localStorage.setItem(FRAPPE_THEME_KEY, resolvedTheme);
            // Also toggle the `dark` class on <html> so Frappe's own styles respond
            document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
        }
    }, [resolvedTheme]);

    const toggle = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

    return (
        <button
            onClick={toggle}
            title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
            {resolvedTheme === "dark"
                ? <Sun size={14} />
                : <Moon size={14} />}
        </button>
    );
}
