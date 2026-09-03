import type { NextConfig } from "next";

const previewUploadMb = Number.parseInt(process.env.MAX_PREVIEW_UPLOAD_MB ?? "200", 10);
const finalUploadMb = Number.parseInt(process.env.MAX_FINAL_UPLOAD_MB ?? "100", 10);
const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: `${Math.max(Number.isFinite(previewUploadMb)&&previewUploadMb>0?previewUploadMb:200,Number.isFinite(finalUploadMb)&&finalUploadMb>0?finalUploadMb:100)}mb` },
  },
};

export default nextConfig;
