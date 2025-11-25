import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";
import withPreline from "preline/plugin"

const config: Config = {
    theme: {
        extend: {
            fontFamily: {
                outfit: ['var(--font-outfit)', 'sans-serif'],
            },
        }
    },
    darkMode: 'class',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./node_modules/preline/dist/*.js"
    ],
    plugins: [
        heroui(),
        withPreline
    ]
};
export default config;
