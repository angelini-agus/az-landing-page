# AZ Servicios de Limpieza — Landing Page

Landing page oficial de **AZ Servicios de Limpieza**, empresa especializada en servicios integrales de limpieza y desinfección para consorcios residenciales, oficinas corporativas y centros de salud/clínicas en la ciudad de Rosario, Santa Fe.

El sitio presenta la propuesta de valor de la compañía: personal propio asegurado (sin tercerización), control de turnos mediante trazabilidad QR y geolocalización GPS, y contacto calificado a través de un formulario guiado por pasos.

---

## Capturas del Sitio

### Desktop (1440 × 900)
![desktop](docs/screenshots/desktop.png)

### Mobile (390 × 844)
<p align="center">
  <img src="docs/screenshots/mobile.png" alt="mobile" width="390" />
</p>

---

## Stack Tecnológico

- **Framework:** [Astro 7](https://astro.build/) (Static Site Generation / SSG).
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/) (modo estricto).
- **Estilos y Diseño:** [Tailwind CSS v4](https://tailwindcss.com/) (configuración CSS-first mediante directivas `@theme` en `src/styles/global.css`).
- **Smooth Scroll:** [Lenis](https://lenis.darkroom.engineering/) para inercia fluida de scroll.
- **Fuentes:** `@fontsource-variable/parkinsans` (títulos y display) e `@fontsource-variable/inter-tight` (cuerpo y datos).
- **Testing:** [Vitest](https://vitest.dev/) (unitario/lógica) y [Playwright](https://playwright.dev/) (E2E y regresión visual multi-viewport).
- **Hosting & CDN:** [Vercel](https://vercel.com/) con rewrites perimetrales hacia el ERP institucional.

---

## Arquitectura del Proyecto

El código fuente se organiza siguiendo una separación limpia de responsabilidades:

```text
az-landing2/
├── docs/
│   └── screenshots/          # Capturas generadas automáticamente para documentación
├── public/                   # Archivos estáticos directos (favicons, robots.txt, etc.)
├── scripts/
│   └── capture-screenshots.mjs # Script de Playwright para regenerar capturas desktop/mobile
├── src/
│   ├── assets/               # Imágenes optimizadas por Astro (WebP, badges, fotos del equipo)
│   ├── components/           # Componentes de UI y secciones de la landing
│   │   ├── ui/               # Componentes atómicos e independientes (botones, burbujas, iconos)
│   │   └── *.astro           # Secciones modulares de página (Hero, Servicios, Contacto, FAQ, etc.)
│   ├── content/              # Colecciones de contenido tipadas y datos del sitio (site.json)
│   ├── layouts/              # Plantillas estructurales (BaseLayout.astro con SEO y cabeceras)
│   ├── lib/                  # Helpers desacoplados, utilidades de scroll y offsets del dock
│   ├── pages/                # Rutas estáticas del sitio (index.astro, 404.astro)
│   └── styles/               # Tokens de diseño y variables globales en global.css
├── tests/
│   └── e2e/                  # Tests end-to-end, responsive y de consola con Playwright
├── astro.config.mjs          # Configuración del bundler Astro e integraciones
├── package.json              # Dependencias y scripts de desarrollo
└── vercel.json               # Configuración de proxy y rewrites hacia el ERP institucional
```

### Detalle de Carpetas Principales

- **`src/content/`**: Datos centralizados y esquemas tipados con Content Collections (`site.json`), fuente de verdad de métricas y textos.
- **`src/components/ui/`**: Primitivas visuales atómicas sin lógica de negocio (`Button.astro`, `Bubble.astro`, `CtaRampButton.astro`).
- **`src/components/`**: Secciones compuestas de la landing (`Hero.astro`, `SocialProof.astro`, `ServicesSection.astro`, `ProblemStatement.astro`, `ValueSection.astro`, `HowItWorksSection.astro`, `FaqSection.astro`, `ContactSection.astro`, `Footer.astro`).
- **`src/lib/`**: Funciones auxiliares puras y algoritmos de posicionamiento de scroll/offsets dinámicos.
- **`src/layouts/`**: Maquetado base (`BaseLayout.astro`), gestión de metadatos OpenGraph, preloads y contenedor del canvas/smooth scroll.
- **`src/pages/`**: Enrutador de Astro basado en archivos. Renderiza la home (`/`) y la página de error personalizada (`/404`).

---

## Cómo Correr el Proyecto en Local

### 1. Prerrequisitos
- **Node.js**: versión 18.17.0 o superior (recomendado Node 20 LTS o 22).
- **npm**: versión 9 o superior.

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Servidor de Desarrollo
```bash
npm run dev
```
Por defecto, Astro iniciará el servidor local en:
👉 **`http://localhost:4321`**

### 4. Build de Producción y Preview
Para generar el bundle estático y previsualizarlo tal como se servirá en producción:
```bash
npm run build
npm run preview
```

---

## Variables de Entorno

El proyecto cuenta con un archivo de ejemplo `.env.example`. Para entornos locales o despliegues personalizados, se pueden definir las siguientes variables:

```bash
# URL canónica para generación de sitemap y metadatos SEO
PUBLIC_SITE_URL=https://www.azserviciosdelimpieza.com

# Integración del formulario de contacto (opcional)
CONTACT_API_KEY=
CONTACT_NOTIFICATION_EMAIL=
```

> **IMPORTANTE — Seguridad de Credenciales:**  
> Nunca agregues valores secretos ni comitees archivos `.env` al repositorio. Cualquier credencial o clave de API privada debe configurarse exclusivamente desde el panel de **Vercel** (`Settings → Environment Variables`).

---

## Deploy e Integración con el ERP (Vercel)

El sitio se encuentra desplegado en producción en **Vercel** bajo el dominio oficial:
- [https://azserviciosdelimpieza.com](https://azserviciosdelimpieza.com) (con redirección canónica a `www.azserviciosdelimpieza.com`)

### El Rol Crítico de `vercel.json` (Proxy hacia el ERP)

En la raíz del proyecto se encuentra el archivo [`vercel.json`](./vercel.json). **Este archivo NO es accidental ni opcional**:

AZ Servicios de Limpieza cuenta con un ERP interno de gestión operativa y control de personal (desarrollado en Angular, repositorio `az-sistema-prod`). Para evitar fragmentar la identidad de marca en múltiples subdominios y facilitar el acceso a clientes y empleados, Vercel actúa como proxy inverso:

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

- Cualquier solicitud a `/login` o `/login/*` es proxeada transparentemente por Vercel hacia la aplicación del ERP.
- El navbar y el footer de esta landing incluyen el botón institucional **Acceso empleados**, que apunta a `/login`.
- Si un usuario ya tiene una sesión iniciada en el ERP (`az_erp_session` o `currentUser` en `localStorage`), el layout detecta la sesión y lo redirige automáticamente a su panel de trabajo.

---

## Testing y Calidad

El proyecto incluye suites completas de testing unitario y end-to-end:

### 1. Tests Unitarios (Vitest)
Verifican lógica desacoplada y utilidades puras:
```bash
npm test
```

### 2. Tests End-to-End (Playwright)
Comprueban navegación del navbar dock, validación del formulario multi-paso, ausencia de errores de consola, responsive sin desbordamiento horizontal y alineación en viewports móviles:
```bash
npm run test:e2e
```

### 3. Generación Automática de Capturas de Pantalla
Para regenerar las imágenes documentales de desktop y mobile utilizando Playwright:
```bash
npm run screenshots
```
> **Nota:** El script detecta automáticamente si existe un servidor local corriendo en `http://localhost:4321` para capturar los cambios más recientes del repositorio; en caso contrario, apunta al dominio de producción. También admite pasar una URL específica: `npm run screenshots -- http://localhost:4321`.
