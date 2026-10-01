import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import path from "path";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
};

export default withNextIntl(nextConfig);
