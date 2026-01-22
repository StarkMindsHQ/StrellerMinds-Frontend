import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
        crawlDelay: 0, // No delay for Google
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://strellerminds.com'}/sitemap.xml`,
  };
}
