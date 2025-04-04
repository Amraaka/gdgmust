import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['en', 'mn'],
  defaultLocale: 'en',
  localeDetection: false,
  // localePrefix: 'never' // Optional: Disable locale prefixing
  // localePrefix: 'as-needed' // Optional: Enable locale prefixing
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);