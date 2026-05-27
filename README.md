# 🚀 Agentic Building Diaries

A premium, editorial-style personal blog and digital garden built with **Astro 5** and **Tailwind CSS v4**. This project is designed as a Git-friendly, file-based publishing platform to document system architecture, AI agent telemetry, and data engineering logs in high fidelity.

---

## ⚡ Tech Stack

- **Core Framework**: [Astro v5](https://astro.build/) (Static Site Generation)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using the new `@tailwindcss/vite` integration)
- **UI Components**: [React 19](https://react.dev/) & [Lucide React](https://lucide.dev/)
- **Utility Libraries**: `date-fns` (date parsing & formatting), `clsx` & `tailwind-merge` (conditional class styling)
- **Language**: TypeScript

---

## 📂 Key Architecture & Code Structure

The repository uses a unified content processing pattern that merges standard MDX posts and heavy native HTML pages seamlessly:

```
├── public/                  # Static assets (favicons, SVG drawings)
├── src/
│   ├── components/          # Reusable UI components (Navbar, Article Cards)
│   ├── content/             # Astro Content Collections (legacy/strict schemas)
│   │   ├── about/me.md      # Bio profile schema
│   │   └── blog/            # MDX/Markdown-only blog entries
│   ├── html-posts/          # Standalone custom HTML pages/case studies (e.g. fitness analytics)
│   ├── layouts/             # Page layouts (Layout.astro)
│   ├── lib/
│   │   └── posts.ts         # Unified content parser merging MDX + HTML posts
│   └── pages/               # Routing layer
│       ├── blog/
│       │   ├── [slug].astro # Dynamic post renderer with iframe resize handling for full HTML
│       │   └── index.astro  # Blog landing page
│       ├── index.astro      # Main landing page (Latest Articles)
│       └── projects.astro   # Personal portfolio
```

### Unified Post Loader (`src/lib/posts.ts`)
Instead of restricting the site to Markdown-only content, a custom parser scans both `src/content/blog/` (using Astro's standard content collections) and `src/html-posts/` (reading standalone HTML pages). It parses YAML frontmatter in HTML files (if present) or automatically extracts metadata from the HTML header tags, sorting and unifying all articles chronologically.

---

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js installed (v18.x or higher recommended).

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Development Server
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build and Deploy
Verify everything builds cleanly:
```bash
npm run build
```

This compiles static assets into the `dist/` directory, which is ready to be hosted on any static provider.

---

## ☁️ Deployment on Vercel

This project is fully ready for deployment on **Vercel**:
1. Connect this repository to your Vercel account.
2. Vercel will automatically detect the **Astro** framework.
3. Keep the default settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy!

Every push to the `main` branch will automatically trigger a production build on Vercel.
