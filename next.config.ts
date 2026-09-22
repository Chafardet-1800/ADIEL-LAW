import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://cityapp-pro.s3.us-east-2.amazonaws.com/**"),
      new URL("https://midominio.com/**"),
    ],
  },
};

export default nextConfig;
