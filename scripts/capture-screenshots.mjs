import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'docs', 'screenshots');

const DEFAULT_PROD_URL = 'https://www.azserviciosdelimpieza.com';
const DEFAULT_LOCAL_URL = 'http://localhost:4321';

async function resolveTargetUrl() {
  if (process.argv[2]) return process.argv[2];
  if (process.env.TARGET_URL) return process.env.TARGET_URL;

  // Si el servidor local está activo (dev o preview), lo priorizamos para reflejar el estado actual del repo
  try {
    const res = await fetch(DEFAULT_LOCAL_URL, { method: 'HEAD' });
    if (res.ok || res.status === 200 || res.status === 304) {
      return DEFAULT_LOCAL_URL;
    }
  } catch {
    // Si no está corriendo en local, se apunta a producción
  }
  return DEFAULT_PROD_URL;
}

const viewports = [
  {
    name: 'desktop',
    width: 1440,
    height: 900,
    outputFile: path.join(outputDir, 'desktop.png'),
  },
  {
    name: 'mobile',
    width: 390,
    height: 844,
    outputFile: path.join(outputDir, 'mobile.png'),
  },
];

async function capture() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const targetUrl = await resolveTargetUrl();
  console.log(`[screenshots] Destino: ${targetUrl}`);
  if (targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1')) {
    console.log(
      'Nota: capturando contra entorno local. La versión de producción puede diferir un poco (los rewrites de Vercel no aplican en local).',
    );
  }

  const browser = await chromium.launch({ headless: true });

  try {
    for (const vp of viewports) {
      console.log(`[screenshots] Capturando ${vp.name} (${vp.width}x${vp.height})...`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1.5,
      });
      const page = await context.newPage();

      await page.goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });

      try {
        await page.waitForLoadState('networkidle', { timeout: 6000 });
      } catch {
        // Continuar si networkidle excede el timeout por conexiones persistentes
      }

      // Asegurar que fuentes web estén completamente listas
      await page.evaluate(() => document.fonts.ready);

      // Desplazamiento progresivo para disparar lazy-loading de imágenes e IntersectionObservers
      await page.evaluate(async () => {
        const step = 600;
        const total = document.body.scrollHeight;
        for (let y = 0; y <= total; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });

      // Asegurar visibilidad de bloques data-reveal
      await page.evaluate(() => {
        document.querySelectorAll('[data-reveal]').forEach((el) => {
          el.classList.add('is-visible');
        });
      });

      // Aguardar a que las imágenes visibles estén decodificadas
      await page.evaluate(async () => {
        const visibleImages = Array.from(document.querySelectorAll('img')).filter(
          (img) => img.offsetParent !== null || img.getClientRects().length > 0,
        );
        await Promise.all(
          visibleImages.map((img) => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            if (typeof img.decode === 'function') {
              return Promise.race([
                img.decode(),
                new Promise((resolve) => setTimeout(resolve, 2000)),
              ]).catch(() => {});
            }
            return Promise.resolve();
          }),
        );
      });

      await page.waitForTimeout(600);

      await page.screenshot({
        path: vp.outputFile,
        fullPage: true,
      });

      console.log(`[screenshots] Guardado: ${path.relative(rootDir, vp.outputFile)}`);
      await context.close();
    }
    console.log('[screenshots] Capturas completadas exitosamente.');
  } finally {
    await browser.close();
  }
}

capture().catch((err) => {
  console.error('[screenshots] Error al capturar:', err);
  process.exit(1);
});
