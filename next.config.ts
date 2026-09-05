import type { NextConfig } from "next";

const previewUploadMb = Number.parseInt(process.env.MAX_PREVIEW_UPLOAD_MB ?? "200", 10);
const finalUploadMb = Number.parseInt(process.env.MAX_FINAL_UPLOAD_MB ?? "100", 10);
const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: `${Math.max(Number.isFinite(previewUploadMb)&&previewUploadMb>0?previewUploadMb:200,Number.isFinite(finalUploadMb)&&finalUploadMb>0?finalUploadMb:100)}mb` },
  },
  async headers(){const headers=[{key:"X-Content-Type-Options",value:"nosniff"},{key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},{key:"X-Frame-Options",value:"DENY"},{key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=()"},{key:"Content-Security-Policy",value:"frame-ancestors 'none'; object-src 'none'; base-uri 'self'"}];if(process.env.NODE_ENV==="production"&&/^https:/.test(process.env.NEXTAUTH_URL??""))headers.push({key:"Strict-Transport-Security",value:"max-age=31536000; includeSubDomains"});return[{source:"/:path*",headers}]},
};

export default nextConfig;
