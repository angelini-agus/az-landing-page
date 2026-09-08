import { test, expect } from '@playwright/test';

test('la página carga y el hero es visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main h1')).toContainText('Espacios');
  await expect(page.locator('main h1')).toContainText('impecables');
  await expect(page.locator('#site-header')).toBeVisible();
});

test('cada link del navbar scrollea hasta su sección', async ({ page }) => {
  test.setTimeout(60000);
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
  const staticAurora = page.locator('[data-contact-banner]:visible img');

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

test('servicios: las cards tienen position sticky tanto en mobile como en desktop', async ({ page }) => {
  // Mobile (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#servicios');
  await page.waitForTimeout(400);

  const cardWrappers = page.locator('#servicios .container-page > div.relative > div[data-reveal]');
  const count = await cardWrappers.count();
  expect(count).toBeGreaterThanOrEqual(3);

  for (let i = 0; i < count; i++) {
    const position = await cardWrappers.nth(i).evaluate((el) => window.getComputedStyle(el).position);
    expect(position, `Card ${i + 1} position en mobile`).toBe('sticky');
  }

  // Desktop (1440x900)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);

  for (let i = 0; i < count; i++) {
    const position = await cardWrappers.nth(i).evaluate((el) => window.getComputedStyle(el).position);
    expect(position, `Card ${i + 1} position en desktop`).toBe('sticky');
  }
});

test('hero mobile: contenido superpuesto, dentro del card y contenido en viewport sin scroll', async ({ page }) => {
  for (const { width, height } of [{ width: 375, height: 667 }, { width: 390, height: 900 }]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.waitForTimeout(400);

    const heroCard = page.locator('#inicio .hero-card-mobile');
    const cardBox = await heroCard.boundingBox();
    expect(cardBox, `Hero card visible en ${width}x${height}`).not.toBeNull();

    // 1. El card entra en el primer tramo sin forzar scroll y mantiene margenes superior e inferior simetricos
    expect(cardBox!.y + cardBox!.height).toBeLessThanOrEqual(height);
    const bottomMargin = height - (cardBox!.y + cardBox!.height);
    expect(bottomMargin).toBeGreaterThanOrEqual(20);
    expect(Math.abs(cardBox!.y - bottomMargin)).toBeLessThanOrEqual(1);

    // 2. Todos los elementos de texto están visibles y superpuestos sobre el fondo
    const h1 = page.locator('#inicio h1');
    const pills = page.locator('#inicio .hero-card-mobile span:has-text("50+")').first();
    const copy = page.locator('#inicio .hero-card-mobile p').first();
    const cta = page.locator('#inicio .hero-card-mobile a[href="#contacto"]');

    await expect(h1).toBeVisible();
    await expect(pills).toBeVisible();
    await expect(copy).toBeVisible();
    await expect(cta).toBeVisible();

    // 3. El CTA está contenido dentro del bounding box del card
    const ctaBox = await cta.boundingBox();
    expect(ctaBox!.y + ctaBox!.height).toBeLessThanOrEqual(cardBox!.y + cardBox!.height);

    // 4. Stacking: el contenedor de texto tiene z-index por encima de la foto de fondo
    const contentZIndex = await page.locator('#inicio .hero-card-mobile > div.relative.z-10').evaluate(
      (el) => parseInt(window.getComputedStyle(el).zIndex, 10),
    );
    expect(contentZIndex).toBeGreaterThan(0);
  }
});

test('contacto mobile: pasos 2 y 3 alineados sin corte a la izquierda', async ({ page }) => {
  for (const { width, height } of [{ width: 375, height: 667 }, { width: 390, height: 844 }]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.goto('/#contacto');
    await page.waitForTimeout(400);

    // Avanzar a paso 2
    await page.locator('button[data-space-option="consorcio"]').click();
    await page.waitForTimeout(600);

    const step2Metrics = await page.evaluate(() => {
      const container = document.getElementById('steps-container');
      const panel = document.getElementById('step-panel-2');
      const firstInput = document.getElementById('nombre');
      const cRect = container?.getBoundingClientRect();
      const pRect = panel?.getBoundingClientRect();
      const iRect = firstInput?.getBoundingClientRect();
      return {
        scrollLeft: container?.scrollLeft ?? -1,
        containerLeft: cRect?.left ?? 0,
        panelLeft: pRect?.left ?? 0,
        inputLeft: iRect?.left ?? 0,
      };
    });

    expect(step2Metrics.scrollLeft, `scrollLeft en paso 2 (${width}x${height})`).toBe(0);
    expect(Math.abs(step2Metrics.panelLeft - step2Metrics.containerLeft)).toBeLessThanOrEqual(5);
    expect(Math.abs(step2Metrics.inputLeft - step2Metrics.containerLeft)).toBeLessThanOrEqual(5);

    // Completar y avanzar a paso 3
    await page.locator('#nombre').fill('Juan Pérez');
    await page.locator('#institucion').fill('Consorcio Av. Libertador 1400');
    await page.locator('#email').fill('admin@edificio.com');
    await page.locator('#telefono').fill('11 2345-6789');
    await page.locator('#btn-step2-next').click();
    await page.waitForTimeout(600);

    const step3Metrics = await page.evaluate(() => {
      const container = document.getElementById('steps-container');
      const panel = document.getElementById('step-panel-3');
      const cRect = container?.getBoundingClientRect();
      const pRect = panel?.getBoundingClientRect();
      return {
        scrollLeft: container?.scrollLeft ?? -1,
        containerLeft: cRect?.left ?? 0,
        panelLeft: pRect?.left ?? 0,
      };
    });

    expect(step3Metrics.scrollLeft, `scrollLeft en paso 3 (${width}x${height})`).toBe(0);
    expect(Math.abs(step3Metrics.panelLeft - step3Metrics.containerLeft)).toBeLessThanOrEqual(5);
  }
});

test('contacto: los inputs y opciones no cortan sus sombras ni focus ring con overflow', async ({ page }) => {
  await page.goto('/#contacto');
  await page.waitForTimeout(600);

  const option = page.locator('button[data-space-option="consorcio"]');
  await option.focus();
  await page.screenshot({ path: 'test-results/focus-step1.png' });

  await option.click();
  await page.waitForTimeout(600);

  const input = page.locator('#nombre');
  await input.focus();
  await page.screenshot({ path: 'test-results/focus-step2.png' });
});