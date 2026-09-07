import { test, expect } from '@playwright/test';

test('la página carga y el hero es visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main h1')).toContainText('Espacios');
  await expect(page.locator('main h1')).toContainText('impecables');
  await expect(page.locator('#site-header')).toBeVisible();
});

test('cada link del navbar scrollea hasta su sección', async ({ page }) => {
  await page.goto('/');

  const cases = [
    { label: 'Nosotros', section: '#quienes-somos' },
    { label: 'Servicios', section: '#servicios' },
    { label: '¿Te pasó?', section: '#el-problema' },
    { label: 'Funcionamiento', section: '#como-funciona' },
    { label: 'FAQ', section: '#faq' },
  ];

  for (const { label, section } of cases) {
    const link = page.locator(`[data-dock-nav] a:has-text("${label}")`).first();
    await link.click();
    await page.waitForTimeout(1600);
    const sectionBox = await page.locator(section).boundingBox();
    expect(sectionBox, `${label} → ${section}`).not.toBeNull();
    // La sección queda visible (offset dentro del viewport, no tapada por el navbar)
    const navbarBox = await page.locator('#site-header').boundingBox();
    expect(sectionBox!.y).toBeGreaterThanOrEqual((navbarBox?.y ?? 0) - 10);
    expect(sectionBox!.y).toBeLessThan(600);
  }
});

test('form: flujo multi-paso completo con datos válidos y resumen', async ({ page }) => {
  await page.goto('/#contacto');
  await page.waitForTimeout(500);

  // Paso 1: Seleccionar espacio
  await page.locator('button[data-space-option="consorcio"]').click();
  await page.waitForTimeout(300);

  // Paso 2: Completar datos de contacto (incluyendo teléfono)
  await page.locator('#nombre').fill('Juan Pérez');
  await page.locator('#institucion').fill('Consorcio Av. Libertador 1400');
  await page.locator('#email').fill('admin@edificio.com');
  await page.locator('#telefono').fill('11 2345-6789');

  await page.locator('#btn-step2-next').click();
  await page.waitForTimeout(300);

  // Paso 3: Verificar que el resumen muestre los datos correctos
  await expect(page.locator('#summary-tipo-espacio')).toContainText('Consorcio');
  await expect(page.locator('#summary-institucion')).toContainText('Consorcio Av. Libertador 1400');
  await expect(page.locator('#summary-nombre')).toContainText('Juan Pérez');
  await expect(page.locator('#summary-email')).toContainText('admin@edificio.com');
  await expect(page.locator('#summary-telefono')).toContainText('11 2345-6789');

  // Enviar formulario
  await page.locator('#contact-form button[type="submit"]').click();
  await page.waitForTimeout(300);

  await expect(page.locator('#form-error-live')).toContainText('Formulario enviado');
  await expect(page.locator('#step-panel-success')).toBeVisible();
});

test('form: botón volver retrocede entre pasos correctamente', async ({ page }) => {
  await page.goto('/#contacto');
  await page.waitForTimeout(500);

  // Paso 1 -> Paso 2
  await page.locator('button[data-space-option="oficina"]').click();
  await page.waitForTimeout(300);
  await expect(page.locator('#nombre')).toBeVisible();

  // Paso 2 -> Volver al Paso 1
  await page.locator('#btn-step2-back').click();
  await page.waitForTimeout(300);
  await expect(page.locator('button[data-space-option="oficina"]')).toBeVisible();

  // Paso 1 -> Seleccionar Clínica -> Paso 2
  await page.locator('button[data-space-option="clinica"]').click();
  await page.waitForTimeout(300);
  await expect(page.locator('#nombre')).toBeVisible();

  // Llenar y avanzar al Paso 3
  await page.locator('#nombre').fill('Dra. Gómez');
  await page.locator('#institucion').fill('Centro Médico Norte');
  await page.locator('#email').fill('dra.gomez@clinica.com');
  await page.locator('#telefono').fill('11 9876-5432');
  await page.locator('#btn-step2-next').click();
  await page.waitForTimeout(300);

  // Paso 3 -> Volver al Paso 2
  await page.locator('#btn-step3-back').click();
  await page.waitForTimeout(300);
  await expect(page.locator('#nombre')).toHaveValue('Dra. Gómez');
});

test('form: validación en paso 2 con campos vacíos o email/teléfono inválido', async ({ page }) => {
  await page.goto('/#contacto');
  await page.waitForTimeout(500);

  // Ir a paso 2
  await page.locator('button[data-space-option="consorcio"]').click();
  await page.waitForTimeout(300);

  // Intentar avanzar con campos vacíos
  await page.locator('#btn-step2-next').click();
  await expect(page.locator('[data-field-error]')).toHaveCount(4);

  // Llenar con datos inválidos
  await page.locator('#nombre').fill('Juan');
  await page.locator('#institucion').fill('Edificio Centro');
  await page.locator('#email').fill('no-es-email');
  await page.locator('#telefono').fill('12');
  await page.locator('#btn-step2-next').click();

  await expect(page.locator('#email-error')).toContainText('formato válido');
  await expect(page.locator('#telefono-error')).toContainText('teléfono válido');
});

test('responsive: no hay overflow horizontal en los breakpoints', async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(300);

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasOverflow, `overflow horizontal a ${width}px`).toBe(false);
  }
});

test('contacto fondo: tanto móvil como desktop usan SVG estático de aurora sin WebGL', async ({ page }) => {
  // 1. Mobile viewport (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#contacto');
  await page.waitForTimeout(600);

  const canvas = page.locator('canvas[data-shader-canvas]');
  const staticAurora = page.locator('[data-contact-banner] img');

  // En móvil: el SVG estático es visible y no hay canvas WebGL
  await expect(staticAurora).toBeVisible();
  await expect(canvas).toHaveCount(0);

  // 2. Desktop viewport (1440x900)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#contacto');
  await page.waitForTimeout(600);

  // En desktop: el SVG estático sigue siendo el fondo visible sin canvas WebGL
  await expect(staticAurora).toBeVisible();
  await expect(canvas).toHaveCount(0);
});

test('branding: el nuevo favicon está presente y el viejo favicon.svg fue eliminado', async ({ page }) => {
  await page.goto('/');
  const oldSvgFavicon = page.locator('link[rel="icon"][href*="favicon.svg"]');
  await expect(oldSvgFavicon).toHaveCount(0);

  const pngFavicon = page.locator('link[rel="icon"][href="/favicon-32x32.png"]');
  await expect(pngFavicon).toHaveCount(1);

  const appleTouchIcon = page.locator('link[rel="apple-touch-icon"][href="/apple-touch-icon.png"]');
  await expect(appleTouchIcon).toHaveCount(1);
});

test('institucional: botón de acceso a empleados en footer y menú móvil', async ({ page }) => {
  await page.goto('/');

  // Footer: botón 'Acceso empleados'
  const footerLoginBtn = page.locator('footer a[href="/login"]');
  await expect(footerLoginBtn).toBeVisible();
  await expect(footerLoginBtn).toContainText('Acceso empleados');

  // Menú móvil: abrir menú hamburguesa y verificar botón 'Acceso empleados'
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click('#nav-toggle');
  const mobileLoginBtn = page.locator('#mobile-menu a[href="/login"]');
  await expect(mobileLoginBtn).toBeVisible();
  await expect(mobileLoginBtn).toContainText('Acceso empleados');
});