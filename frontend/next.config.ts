import type { NextConfig } from "next";

const basePath = "/paper";
const nextDevOrigin =
    process.env.NEXT_DEV_ORIGIN ??
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

const nextConfig: NextConfig = {
    basePath,
    assetPrefix: nextDevOrigin ? `${nextDevOrigin}${basePath}` : undefined,
    async headers() {
        if (!nextDevOrigin) return [];
        return [
            {
                source: "/_next/static/:path*",
                headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
            },
        ];
    },
};

export default nextConfig;
