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
  ])
}

module.exports = nextConfig
