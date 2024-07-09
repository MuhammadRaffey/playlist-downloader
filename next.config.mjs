/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/downloads/:path*",
        destination: path.join(process.cwd(), "downloads", ":path*"),
      },
    ];
  },
};

export default nextConfig;
