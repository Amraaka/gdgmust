import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove this if not specifically needed
  // publicRuntimeConfig: {
  //   staticFolder: '/src/public',
  // },
  // Other Next.js config options...
};

const withNextIntl = createNextIntlPlugin();
 
export default withNextIntl(nextConfig);