import type { APIRoute } from 'astro';
import { getUnifiedPosts } from '../lib/posts';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site ? site.toString() : 'https://agentdiaries.hexora.ca').replace(/\/$/, '');
  const posts = await getUnifiedPosts();

  const rssItemsXml = posts
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const categoriesXml = (post.data.tags || [])
        .map((tag) => `      <category><![CDATA[${tag}]]></category>`)
        .join('\n');

      return `    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.data.description}]]></description>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
${categoriesXml ? categoriesXml + '\n' : ''}    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Agentic Diaries</title>
    <link>${baseUrl}</link>
    <description>Notes from building AI systems, thinking through messy ideas, and figuring things out in public.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${rssItemsXml}
  </channel>
</rss>`.trim();

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};

