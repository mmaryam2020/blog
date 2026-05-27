import fs from 'node:fs/promises';
import path from 'node:path';
import { getCollection } from 'astro:content';

export interface UnifiedPost {
  slug: string;
  isHtml: boolean;
  body: string;
  data: {
    title: string;
    description: string;
    date: Date;
    tags: string[];
    category?: string;
  };
  _originalEntry?: any;
}

export async function getUnifiedPosts(): Promise<UnifiedPost[]> {
  // 1. Get Markdown/MDX posts via Astro's built-in getCollection
  const mdPosts = await getCollection('blog');
  const unifiedMdPosts: UnifiedPost[] = mdPosts.map((post) => ({
    slug: post.slug,
    isHtml: false,
    body: post.body || '',
    data: {
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
      tags: post.data.tags || [],
      category: post.data.category,
    },
    _originalEntry: post,
  }));

  // 2. Scan src/html-posts/ folder for .html files
  const htmlPosts: UnifiedPost[] = [];
  const htmlBlogDir = path.resolve('src/html-posts');
  
  try {
    const files = await fs.readdir(htmlBlogDir);
    for (const file of files) {
      if (path.extname(file).toLowerCase() === '.html') {
        const filePath = path.join(htmlBlogDir, file);
        const slug = path.basename(file, '.html');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const stat = await fs.stat(filePath);
        
        // Parse frontmatter (if present)
        let title = slug.replace(/-/g, ' ');
        let description = '';
        let date = stat.mtime; // default to file modification date
        let tags: string[] = [];
        let category: string | undefined = undefined;
        let htmlToParse = fileContent;
        
        const frontmatterMatch = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
        if (frontmatterMatch) {
          const yamlStr = frontmatterMatch[1];
          htmlToParse = frontmatterMatch[2];
          
          const lines = yamlStr.split('\n');
          let currentKey = '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            if (trimmed.startsWith('-')) {
              // List item
              if (currentKey === 'tags') {
                const val = trimmed.slice(1).trim().replace(/^['"]|['"]$/g, '');
                tags.push(val);
              }
            } else {
              const colonIdx = trimmed.indexOf(':');
              if (colonIdx !== -1) {
                const key = trimmed.slice(0, colonIdx).trim().toLowerCase();
                let val = trimmed.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
                
                if (key === 'title') title = val;
                else if (key === 'description') description = val;
                else if (key === 'date') date = new Date(val);
                else if (key === 'category') category = val;
                else if (key === 'tags') {
                  if (val.startsWith('[') && val.endsWith(']')) {
                    tags = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
                  } else {
                    currentKey = 'tags';
                  }
                }
              }
            }
          }
        } else {
          // No frontmatter, let's try to extract from HTML tags
          const titleMatch = fileContent.match(/<title>([\s\S]*?)<\/title>/i) || fileContent.match(/<h1>([\s\S]*?)<\/h1>/i);
          if (titleMatch) {
            title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
          }
          
          const descMatch = fileContent.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || fileContent.match(/<p>([\s\S]*?)<\/p>/i);
          if (descMatch) {
            description = descMatch[1].replace(/<[^>]*>/g, '').trim();
            if (description.length > 160) {
              description = description.slice(0, 157) + '...';
            }
          }
        }
        
        // For full HTML files, let's extract stylesheet link tags, style tags, and the body tag content
        let body = htmlToParse;
        const styleMatches = [...htmlToParse.matchAll(/<style[\s\S]*?>([\s\S]*?)<\/style>/gi)];
        const linkMatches = [...htmlToParse.matchAll(/<link\s+[^>]*rel="stylesheet"[^>]*>/gi)];
        const stylesHtml = [
          ...linkMatches.map(m => m[0]),
          ...styleMatches.map(m => m[0])
        ].join('\n');
        
        const bodyMatch = htmlToParse.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
          body = stylesHtml + '\n' + bodyMatch[1];
        } else {
          body = stylesHtml + '\n' + htmlToParse;
        }
        
        htmlPosts.push({
          slug,
          isHtml: true,
          body,
          data: {
            title,
            description,
            date,
            tags,
            category,
          },
        });
      }
    }
  } catch (err) {
    console.error('Error scanning HTML files:', err);
  }

  // 3. Merge and sort all posts
  const allPosts = [...unifiedMdPosts, ...htmlPosts];
  return allPosts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
