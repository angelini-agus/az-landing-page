# AZ Servicios de Limpieza — Landing Page

Official landing page for **AZ Servicios de Limpieza**, a commercial cleaning and disinfection company serving residential complexes (condominiums/HOAs), corporate offices, and medical clinics in Rosario, Santa Fe.

The site highlights the company's core value proposition: fully insured internal staff (no third-party subcontractors), real-time shift verification via QR and GPS tracking, and a qualified multi-step contact workflow.

---

## Site Previews

### Desktop (1440 × 900)
![desktop](docs/screenshots/desktop.png)

### Mobile (390 × 844)
<p align="center">
  <img src="docs/screenshots/mobile.png" alt="mobile" width="390" />
</p>

---

## Tech Stack

- **Framework:** [Astro 7](https://astro.build/) (Static Site Generation / SSG).
- **Language:** [TypeScript 5](https://www.typescriptlang.org/) (Strict mode).
- **Styling & Design:** [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first architecture with `@theme` directives in `src/styles/global.css`).
- **Smooth Scroll:** [Lenis](https://lenis.darkroom.engineering/) for fluid scroll momentum.
- **Typography:** `@fontsource-variable/parkinsans` (headings and display) and `@fontsource-variable/inter-tight` (body text and data points).
- **Testing:** [Vitest](https://vitest.dev/) (unit / logic) and [Playwright](https://playwright.dev/) (E2E and multi-viewport visual regression).
- **Hosting & CDN:** [Vercel](https://vercel.com/) with edge rewrites pointing to the internal ERP.

---

## Project Architecture

The source code follows a clear separation of concerns:

```text
az-landing2/
├── docs/
│   └── screenshots/            # Automated preview screenshots for documentation
├── public/                     # Static direct assets (favicons, robots.txt, etc.)
├── scripts/
│   └── capture-screenshots.mjs # Playwright script to regenerate desktop/mobile screenshots
├── src/
│   ├── assets/                 # Astro-optimized images (WebP, badges, team photos)
│   ├── components/             # UI components and landing page sections
│   │   ├── ui/                 # Atomic, self-contained UI primitives (buttons, bubbles, icons)
│   │   └── *.astro             # Modular page sections (Hero, Services, Contact, FAQ, etc.)
│   ├── content/                # Typed content collections and site data (site.json)
│   ├── layouts/                # Structural layout templates (BaseLayout.astro with SEO and headers)
│   ├── lib/                    # Decoupled helpers, scroll utilities, and dock offset calculators
│   ├── pages/                  # File-based static routes (index.astro, 404.astro)
│   └── styles/                 # Design tokens and global CSS variables in global.css
├── tests/
│   └── e2e/                    # End-to-end, responsive, and console error tests with Playwright
├── astro.config.mjs            # Astro bundler configuration and integrations
├── package.json                # Project dependencies and development scripts
└── vercel.json                 # Edge proxy and rewrite configuration for the internal ERP
```

### Key Directory Breakdown

- **`src/content/`**: Centralized data and typed schemas powered by Astro Content Collections (`site.json`), acting as the single source of truth for copy and metrics.
- **`src/components/ui/`**: Atomic, presentation-only primitives without business logic (`Button.astro`, `Bubble.astro`, `CtaRampButton.astro`).
- **`src/components/`**: Composite landing sections (`Hero.astro`, `SocialProof.astro`, `ServicesSection.astro`, `ProblemStatement.astro`, `ValueSection.astro`, `HowItWorksSection.astro`, `FaqSection.astro`, `ContactSection.astro`, `Footer.astro`).
- **`src/lib/`**: Pure utility functions and dynamic scroll/offset calculations.
- **`src/layouts/`**: Base HTML skeleton (`BaseLayout.astro`), OpenGraph metadata, resource preloads, and the background canvas/smooth scroll container.
- **`src/pages/`**: Astro file-based router. Serves the landing homepage (`/`) and a customized error page (`/404`).

---

## Local Development

### 1. Prerequisites
- **Node.js**: version 18.17.0 or higher (Node 20 LTS or 22 recommended).
- **npm**: version 9 or higher.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
By default, Astro runs the local dev server at:
👉 **`http://localhost:4321`**

### 4. Production Build & Preview
To build the static distribution bundle and test it locally:
```bash
npm run build
npm run preview
```

---

## Environment Variables

An example configuration file is provided in `.env.example`. For local development or custom deployments, configure the following variables:

```bash
# Canonical URL for sitemap generation and OpenGraph SEO metadata
PUBLIC_SITE_URL=https://www.azserviciosdelimpieza.com

# Contact form backend integration (optional)
CONTACT_API_KEY=
CONTACT_NOTIFICATION_EMAIL=
```

> **IMPORTANT — Credential Security:**  
> Never commit secrets or actual `.env` files to the repository. All production credentials and API keys must be managed through **Vercel** (`Settings → Environment Variables`).

---

## Deployment & ERP Integration (Vercel)

The site is deployed in production on **Vercel** under the official domain:
- [https://azserviciosdelimpieza.com](https://azserviciosdelimpieza.com) (with canonical redirect to `www.azserviciosdelimpieza.com`)

### The Role of `vercel.json` (ERP Edge Proxy)

The repository root includes a [`vercel.json`](./vercel.json) file. **This file is intentional and critical**:

AZ Servicios de Limpieza maintains an internal operations and personnel management ERP (built with Angular in the `az-sistema-prod` repository). To preserve brand continuity across a single domain rather than fragmenting into subdomains, Vercel functions as a reverse proxy:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://api-az-limpieza.somee.com/api/:path*"
    },
    {
      "source": "/login",
      "destination": "https://az-sistema-prod-angelini-agus-projects.vercel.app/"
    },
    {
      "source": "/login/",
      "destination": "https://az-sistema-prod-angelini-agus-projects.vercel.app/"
    },
    {
      "source": "/login/:path*",
      "destination": "https://az-sistema-prod-angelini-agus-projects.vercel.app/:path*"
    }
  ]
}
```

- Requests to `/login` or `/login/*` are transparently proxied by Vercel to the hosted Angular ERP.
- Both the navbar and footer include an institutional **Employee Access** button linking directly to `/login`.
- If a user already has an active ERP session (`az_erp_session` or `currentUser` in `localStorage`), the layout detects it and automatically redirects them to their dashboard.

---

## Testing & Quality Assurance

The repository includes test suites for both unit logic and end-to-end browser flows:

### 1. Unit Tests (Vitest)
Validates pure utilities and decoupled business logic:
```bash
npm test
```

### 2. End-to-End Tests (Playwright)
Validates dock navigation, multi-step contact form submission, console error detection, horizontal scroll prevention, and mobile viewport alignment:
```bash
npm run test:e2e
```

### 3. Automated Screenshot Generation
Regenerates documentation screenshots for desktop and mobile viewports via Playwright:
```bash
npm run screenshots
```
> **Note:** The script checks if a local server is running on `http://localhost:4321` to capture the latest uncommitted changes; otherwise, it falls back to the production URL. You can also supply a custom target URL: `npm run screenshots -- http://localhost:4321`.
