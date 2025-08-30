import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  images: {
    domains: ['api.coindcx.com']
  }
}

export default nextConfig
