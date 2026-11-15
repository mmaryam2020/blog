import type { APIRoute } from 'astro';
import { getUnifiedPosts } from '../lib/posts';

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site ? site.toString() : 'https://agentdiaries.hexora.ca').replace(/\/$/, '');
  const posts = await getUnifiedPosts();

  const staticPages: SitemapEntry[] = [
    { url: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { url: `${baseUrl}/blog`, priority: '0.9', changefreq: 'weekly' },
    { url: `${baseUrl}/learn`, priority: '0.9', changefreq: 'weekly' },
    { url: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly' },
    { url: `${baseUrl}/projects`, priority: '0.8', changefreq: 'monthly' },
  ];

  const postPages: SitemapEntry[] = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.data.date.toISOString(),
    priority: '0.8',
    changefreq: 'monthly',
  }));

  const allEntries: SitemapEntry[] = [...staticPages, ...postPages];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map((entry) => `  <url>
    <loc>${entry.url}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`)
  .join('\n')}
</urlset>`.trim();

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
