"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 border border-gray-200 dark:border-gray-800 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 shadow-sm"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? <FaSun className="text-yellow-500 w-4 h-4" /> : <FaMoon className="text-indigo-600 w-4 h-4" />}
        </button>
    );
}
