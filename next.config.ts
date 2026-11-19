import type { NextConfig } from "next";
import dns from "node:dns";

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_TOMTOM_API_KEY:
      process.env.NEXT_PUBLIC_TOMTOM_API_KEY ||
      process.env.TOM_TOM_API_KEY ||
      process.env.NEXT_PUBLIC_TOM_TOM_API_KEY ||
      "",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
