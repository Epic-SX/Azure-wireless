/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = withPWA({
  env: {
    NEXT_PUBLIC_rePr_wireless_API_URL: process.env.NEXT_PUBLIC_rePr_wireless_API_URL,
    NEXT_PUBLIC_AUDIO_BUCKET_NAME: process.env.NEXT_PUBLIC_AUDIO_BUCKET_NAME,
    NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
  }
});

module.exports = nextConfig;