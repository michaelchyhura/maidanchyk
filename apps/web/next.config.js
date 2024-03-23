/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@maidanchyk/ui"],
  redirects: () => ([
    {
      source: "/auth/reset-password",
      missing: [
        {
          type: "query",
          key: "token",
        },
      ],
      permanent: true,
      destination: "/",
    },
  ]),
  images: {
    domains: ["zpndpclepbmxdzgc.public.blob.vercel-storage.com", 'images.unsplash.com']
  }
}

module.exports = nextConfig
