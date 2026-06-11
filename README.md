# andreweigel.me

<img src="https://raw.githubusercontent.com/AndreWeigel/andreweigel.me/main/public/favicon.png" width="64" alt="pixel art frog" />

My personal site. Projects, blog posts, and a bit about who I am.

## What it is

A static site with:

- **Home**: intro, featured projects, recent blog posts
- **Projects**: things I've built, with descriptions and links
- **Blog**: writing about tech, self-hosting, and whatever else I'm into
- **About**: who I am, what I'm into
- **Contact**: find me elsewhere

## Why Astro

Wanted something that compiles down to plain HTML/CSS with no JS framework, no runtime, no database. Astro does exactly that, so the site ends up fast, cheap to host, and simple to work with.

The pixel-art avatar on the homepage has a custom sprite animation system (`LayeredSprite.astro`) with idle animations, hover reactions, and a clickable hat selector. I got into Aseprite a while back and got completely addicted to making little fun animations, so of course the site ended up with one.

## Tech stack

- **[Astro](https://astro.build)** - static site generator
- **[Tailwind CSS](https://tailwindcss.com)** - styling
- **Markdown** - all blog posts and project entries live in `src/content/` as `.md` files
- No CMS, no database, no server runtime

## Running locally

```bash
npm install
npm run dev
```

Site runs at `http://localhost:4321`.

```bash
npm run build    # build to dist/
npm run preview  # preview the build locally
```

## Project structure

```
src/
├── components/       # Astro components (Header, Footer, ThemeToggle, sprites, cards)
├── content/
│   ├── blog/         # Blog posts as .md files
│   └── projects/     # Project entries as .md files
├── layouts/          # BaseLayout, BlogPostLayout
├── lib/              # Sprite data loader
├── pages/            # Routes: /, /about, /blog, /projects, /contact
└── styles/           # global.css with Tailwind + theme variables
```

Adding a new blog post is just dropping a `.md` file in `src/content/blog/` and rebuilding.

## Deployment

Hosted on a Hetzner VPS running Ubuntu 24.04, served by Nginx.

```bash
npm run build
rsync -avz dist/ root@<server-ip>:/var/www/andreweigel.me/
```

Nginx config:

```nginx
server {
    listen 80;
    server_name andreweigel.me www.andreweigel.me;

    root /var/www/andreweigel.me;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

SSL via Certbot:

```bash
certbot --nginx -d andreweigel.me -d www.andreweigel.me
```
