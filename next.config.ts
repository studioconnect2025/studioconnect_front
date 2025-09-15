import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // permite cualquier carpeta dentro de Cloudinary
      },
    ],
  },
};

export default nextConfig;
