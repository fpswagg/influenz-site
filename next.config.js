/** Public address of SA Storage (where uploaded images and videos are served from). */
const storageUrl = (process.env.SA_STORAGE_PUBLIC_URL || process.env.SA_STORAGE_URL || 'https://sastorage.fpswagg.site').replace(/\/$/, '')
const storageHost = new URL(storageUrl)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_STORAGE_URL: storageUrl,
  },
  images: {
    remotePatterns: [
      {
        protocol: storageHost.protocol.replace(':', ''),
        hostname: storageHost.hostname,
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
    ],
  },
}

module.exports = nextConfig
