import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        optimizePackageImports: ['react-icons', '@heroui/react'],
    },
};

export default nextConfig;