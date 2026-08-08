import type { NextConfig } from "next";

/**
 * The desktop build (Tauri) has no server and can only load static files, so
 * it needs `output: "export"`. The web build (Vercel) should stay a normal
 * dynamic Next.js app so dynamic routes like /proposals/[proposalId] and any
 * future server-side logic work for real, not just for pages that existed at
 * build time.
 *
 * The Tauri CLI automatically injects `TAURI_ENV_PLATFORM` into the
 * environment of `beforeBuildCommand`/`beforeDevCommand` (see
 * src-tauri/tauri.conf.json), so this flips on export mode only when Tauri
 * itself is doing the build — no script changes needed.
 */
const isTauriBuild = Boolean(process.env.TAURI_ENV_PLATFORM);

const nextConfig: NextConfig = {
  ...(isTauriBuild ? { output: "export" as const } : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3845",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "ui.shadcn.com",
        pathname: "/avatars/**",
      },
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
    ],
  },
};

export default nextConfig;
