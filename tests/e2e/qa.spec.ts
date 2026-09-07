import { test, expect } from '@playwright/test';

test('consola: cero errores y warnings en producción', async ({ page }) => {
  // Warnings benignos del entorno headless (no aparecen en navegadores reales):
  // - Chromium: "GPU stall due to ReadPixels" = mensaje de rendimiento del driver WebGL en headless.
  // - WebKit: aviso de preload "not used within a few seconds" cuando la fuente display
  //   (LCP) se consume tras el paint inicial. La fuente sí se usa (H1 con font-display).
  const benignWarnings = [
    'GPU stall due to ReadPixels',
    'was preloaded using link preload but not used',
  ];
  const errors: string[] = [];
  const warnings: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
    if (msg.type() === 'warning' && !benignWarnings.some((b) => msg.text().includes(b))) {
      warnings.push(msg.text());
    }
  });
  page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));

  await page.goto('/');
  await page.waitForTimeout(800);
  // Recorrer la página para disparar reveal, shader, dock y form
  await page.mouse.move(400, 200);
  await page.mouse.move(600, 200);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  expect(errors, `errores de consola: ${errors.join(' | ')}`).toEqual([]);
  expect(warnings, `warnings de consola: ${warnings.join(' | ')}`).toEqual([]);
});

test('404: una ruta inexistente muestra la página propia, no el default', async ({ page }) => {
  const response = await page.goto('/ruta-que-no-existe-xyz');
  expect(response?.status()).toBe(404);
  await expect(page.locator('main h1')).toContainText('no existe');
  await expect(page.locator('main a[href="/"]')).toContainText('Volver al inicio');
});

test('navbar glass: legible en todos los motores', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.waitForTimeout(500);

  const dock = page.locator('[data-dock-nav]');
  if (await dock.isVisible()) {
    await expect(dock).toBeVisible();
    // Texto del navbar con contraste suficiente (no tapado por el glass)
    const text = dock.locator('a:has-text("Servicios")');
    await expect(text).toBeVisible();
    await expect(text).toHaveCSS('color', 'rgb(43, 38, 64)');
  }

  // Mobile: hamburger + menú overlay
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForTimeout(300);
  const toggle = page.locator('#nav-toggle');
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await expect(page.locator('#mobile-menu a:has-text("Servicios")')).toBeVisible();
    await page.screenshot({ path: `test-results/navbar-mobile-${testInfo.project.name}.png` });
  }
});