import type { NextConfig } from "next";
import dns from "node:dns";

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://pbgrhgenxpubcnmptqvv.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZ3JoZ2VueHB1YmNubXB0cXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2MzkyNzksImV4cCI6MjExMDIxNTI3OX0.yWALcW7QAw6saIDtFUtNWmJ3mbqFmdfCgRyOPUJ29-M",
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
