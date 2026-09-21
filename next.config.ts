import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        optimizePackageImports: ['react-icons', '@heroui/react', '@heroui-v3/react'],
        viewTransition: true,
    },
};

export default nextConfig;