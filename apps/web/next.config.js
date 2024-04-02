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
    {
      source: '/sign-in',
      permanent: true,
      destination: "/auth/sign-in",
    },
    {
      source: '/login',
      permanent: true,
      destination: "/auth/sign-in",
    },
    {
      source: '/sign-up',
      permanent: true,
      destination: "/auth/sign-up",
    },
    {
      source: '/register',
      permanent: true,
      destination: "/auth/sign-up",
    }
  ]),
  images: {
    domains: ["zpndpclepbmxdzgc.public.blob.vercel-storage.com", 'images.unsplash.com']
  }
}

module.exports = nextConfig
