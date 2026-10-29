import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  outputFileTracingRoot: __dirname,
  // project pages live at /projects/<slug>/ (sitemap, canonicals and the FigJam board all use the slash)
  trailingSlash: true,
};

export default nextConfig;
