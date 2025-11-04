/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Nécessaire pour Docker
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
