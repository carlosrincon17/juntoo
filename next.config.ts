import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    watchOptions: {
        pollIntervalMs: 1000,
    },
    reactStrictMode: false,
};

export default nextConfig;
