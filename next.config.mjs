/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com", // Keep the existing domain
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com", // Add Firebase Storage
      },
    ],
  },
};

export default nextConfig;
