/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    PAPERCUT_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    PAPERCUT_DOMAIN_URL: process.env.NEXT_PUBLIC_DOMAIN_URL,
    PAPERCUT_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    PAPERCUT_RECAPTCHA_SECRET_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'papercut-api.preview.im',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'papercut.mydevfactory.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
