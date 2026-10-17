/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to ./out,
  // which Cloudflare Pages serves for free. No server features are used.
  output: "export",

  // /contact/ -> out/contact/index.html (clean URLs, no redirect quirks on Pages).
  trailingSlash: true,

  // The Next.js image optimiser needs a server. Images are pre-sized WebP
  // files in /public/images and are rendered with plain <img srcset>.
  images: { unoptimized: true },

  reactStrictMode: true,
};

export default nextConfig;
