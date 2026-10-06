# Agentic Diaries: Agent Rules

This is an Astro 5 + Tailwind CSS v4 blog. It is NOT Next.js.

## Where things live
- MDX posts: `src/content/blog/*.mdx` (styled by `src/styles/global.css`)
- HTML posts: `src/html-posts/*.html` (rendered in an iframe by `src/pages/blog/[slug].astro`; shared styles injected from `src/styles/html-post-reading.css`)
- About page: `src/content/about/me.md` and `src/pages/about.astro`
- Static images & assets: `public/`

## Rules for Agents
- **Styling**: Change colors, typography, and spacing only via CSS variables in `src/styles/global.css` and `src/styles/html-post-reading.css`. Do not introduce ad-hoc inline color overrides.
- **Typography & Layout**: Body text column stays narrow (~68ch max). Body text 17px, line-height 1.7.
- **Post Aesthetic**: Minimalist zine aesthetic. No emoji category badges, no hashtag pills at the top.
- **Assets**: Never embed images as base64 in HTML files. Store images in `public/images/` and reference them by URL (`/images/...`).
- **Heavy Files**: Never read `src/html-posts/Workout-Analytics-and-AI-Coach-Case-Study.html` in full (it contains ~5MB of embedded images; viewing it exhausts context window).
- **Quality Check**: Always run `npm run build` after changes and verify zero errors before finishing.
