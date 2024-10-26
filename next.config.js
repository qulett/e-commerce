const withAnalyzer = require('@next/bundle-analyzer');
const { withContentlayer } = require('next-contentlayer');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: getRemotePatterns(),
  },
};

module.exports = withAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(withContentlayer(nextConfig));

function getRemotePatterns() {
  const remotePatterns = [
    {
      protocol: 'https',
      hostname: 'cdn.dummyjson.com',
      pathname: '/**',
    },
    // Add Supabase hostname for images
    {
      protocol: 'https',
      hostname: 'ffxbmphklnkguyvfsaob.supabase.co',
      pathname: '/storage/v1/object/public/banners/**', // Adjust the path if necessary
    },
  ];

  return IS_PRODUCTION
    ? remotePatterns
    : [
        {
          protocol: 'http',
          hostname: '127.0.0.1',
        },
        ...remotePatterns,
      ];
}
