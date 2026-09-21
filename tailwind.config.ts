import { heroui } from "@heroui/theme";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-outfit)", "sans-serif"],
            },
        },
    },
    plugins: [heroui(), tailwindcssAnimate],
};

export default config;
