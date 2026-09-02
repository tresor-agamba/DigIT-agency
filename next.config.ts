import type { NextConfig } from "next";

const previewUploadMb = Number.parseInt(process.env.MAX_PREVIEW_UPLOAD_MB ?? "200", 10);
const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: `${Number.isFinite(previewUploadMb) && previewUploadMb > 0 ? previewUploadMb : 200}mb` },
  },
};

export default nextConfig;
