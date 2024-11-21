import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";
import withPreline from "preline/plugin"

const config: Config = {
    darkMode: 'class',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./node_modules/preline/dist/*.js"
    ],
    plugins: [
        nextui({
            defaultTheme: "light",
        }), 
        withPreline
    ]
};
export default config;
