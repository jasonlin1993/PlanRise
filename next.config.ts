import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tailwind v4 透過 Turbopack loader 處理 CSS
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
