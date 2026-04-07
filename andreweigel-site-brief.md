# Project Brief: andreweigel.me — Personal Website
## For use with Claude Code in VS Code

---

## Overview

Build a personal website for André Weigel at `andreweigel.me` using **Astro**. The site will be a full personal website with blog, projects showcase, about page, and contact section. It will be deployed as a static site on an existing Hetzner VPS running Ubuntu 24.04 with Nginx.

**GitHub:** github.com/AndreWeigel (25 repos — pull project info from here)

---

## Tech Stack

- **Framework:** Astro (latest stable)
- **Styling:** Tailwind CSS
- **Content:** Markdown files for blog posts and project descriptions
- **Deployment:** Static build (`astro build` → `dist/` folder served by Nginx)
- **No database, no server-side runtime**

---

## Site Structure

```
/                   → Home (hero + brief intro + recent posts + featured projects)
/about              → About page (bio, skills, interests, photo)
/projects           → Projects listing page
/projects/[slug]    → Individual project page
/blog               → Blog listing page
/blog/[slug]        → Individual blog post
/contact            → Contact page (email link, GitHub, LinkedIn)
```

---

## Pages & Content

### Home (`/`)
- Clean hero section with name and a short one-liner
- "Recent posts" section showing latest 3 blog entries
- "Featured projects" section showing 3 highlighted projects
- Links to about, projects, blog

### About (`/about`)
- Short bio — André is a developer and photographer based in Germany (originally from Portugal/Brazil based on the file names). Interested in self-hosting, privacy, open source, and analog photography.
- Skills/tech section
- Photography mention (links to photos.andreweigel.me could be nice)
- Leave placeholder text for André to personalize

### Projects (`/projects`)
- Grid or list of project cards
- Each card: title, short description, tech tags, link to GitHub repo
- Pull project data from markdown files in `src/content/projects/`
- Include a few starter projects based on GitHub profile (iot_device_hub, this personal cloud setup, etc.)
- Use placeholder descriptions that André can fill in

### Blog (`/blog`)
- List of blog posts sorted by date (newest first)
- Each post card: title, date, short excerpt, reading time
- Posts written as `.md` files in `src/content/blog/`

### Blog Post Template
- Clean reading experience with good typography
- Title, date, reading time at the top
- Markdown rendered to HTML (Astro handles this natively)
- Previous/next post navigation at the bottom

### Contact (`/contact`)
- Simple page with links: email, GitHub, LinkedIn
- No contact form needed (keep it simple)

---

## First Blog Post: Draft Outline

Create a starter blog post file: `src/content/blog/building-my-personal-cloud.md`

Topic: "Building My Personal Cloud — Replacing Google with Self-Hosted Services"

Suggested outline (André will write the actual content):
- Why I decided to self-host
- The stack: Hetzner + Docker + open source
- What I replaced: Google Photos → Immich, Google Drive → Nextcloud, NordPass → Vaultwarden
- What it costs (~€14/month vs commercial alternatives)
- What I learned
- What's next

Leave this as a draft with placeholder content and the outline as comments.

---

## Design Direction

- **Minimal and clean** — focus on content and typography
- Light mode by default, dark mode toggle
- Good whitespace, readable font sizes
- No flashy animations or heavy graphics
- Mobile responsive
- The design will be refined later — start with a solid, clean foundation

---

## Content Collections (Astro)

Set up Astro content collections for type-safe content:

```
src/content/
├── blog/
│   ├── building-my-personal-cloud.md
│   └── ...
└── projects/
    ├── personal-cloud.md
    ├── iot-device-hub.md
    └── ...
```

### Blog frontmatter schema:
```yaml
---
title: "Post Title"
date: 2026-04-07
description: "Short excerpt for listing page"
tags: ["self-hosting", "linux", "docker"]
draft: false
---
```

### Project frontmatter schema:
```yaml
---
title: "Project Title"
description: "Short description"
tags: ["python", "docker", "iot"]
github: "https://github.com/AndreWeigel/repo-name"
url: "" # optional live URL
featured: true
date: 2026-01-01
---
```

---

## Project Setup Steps

1. **Scaffold the project:**
   ```bash
   npm create astro@latest andreweigel.me
   ```
   Choose: Empty project, yes to TypeScript (strict), yes to install dependencies

2. **Install Tailwind:**
   ```bash
   npx astro add tailwind
   ```

3. **Create the folder structure:**
   ```
   src/
   ├── components/
   │   ├── Header.astro
   │   ├── Footer.astro
   │   ├── ProjectCard.astro
   │   ├── BlogPostCard.astro
   │   └── ThemeToggle.astro
   ├── layouts/
   │   ├── BaseLayout.astro
   │   └── BlogPostLayout.astro
   ├── pages/
   │   ├── index.astro
   │   ├── about.astro
   │   ├── contact.astro
   │   ├── projects/
   │   │   └── index.astro
   │   └── blog/
   │       └── index.astro
   ├── content/
   │   ├── blog/
   │   └── projects/
   └── styles/
       └── global.css
   ```

4. **Build all pages with real layout and placeholder content**

5. **Test locally:**
   ```bash
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   ```
   Output will be in `dist/`

---

## Deployment (André will do this after building)

Once the site is built locally, deployment to the server is:

1. Build the static site:
   ```bash
   npm run build
   ```

2. Copy `dist/` folder to the server:
   ```bash
   rsync -avz dist/ root@46.224.233.5:/var/www/andreweigel.me/
   ```

3. On the server, create an Nginx config:
   ```bash
   nano /etc/nginx/sites-available/andreweigel
   ```

   ```nginx
   server {
       listen 80;
       server_name andreweigel.me www.andreweigel.me;

       root /var/www/andreweigel.me;
       index index.html;

       location / {
           try_files $uri $uri/ $uri.html =404;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 30d;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. Enable and get SSL:
   ```bash
   ln -s /etc/nginx/sites-available/andreweigel /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   certbot --nginx -d andreweigel.me -d www.andreweigel.me
   ```

5. Add DNS A records in Gandi.net:
   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | A | @ | 46.224.233.5 | 300 |
   | A | www | 46.224.233.5 | 300 |

---

## Important Notes for Claude Code

- Keep it simple — this is a v1, design will be refined later
- Use semantic HTML
- Make sure all pages are responsive
- Use Astro's built-in content collections for blog and projects
- Don't over-engineer — no CMS, no auth, no API routes
- The site is purely static
- Leave placeholder content where André needs to write his own text (mark with TODO comments)
- Make the blog post writing experience easy — just add a .md file and rebuild

---

*Brief created April 2026*
