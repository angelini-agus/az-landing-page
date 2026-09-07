# AGENTS.md — AZ Servicios de Limpieza (az-landing2)

Copy oficial de la landing page. Fuente de verdad del contenido; no inventar
métricas, testimonios ni datos no confirmados por el cliente.

## Encuadre del negocio (qué NO es esta landing)

- Cliente objetivo: **administradores de consorcios, oficinas y clínicas**. Nada de hogares/particulares.
- AZ no ofrece bolsa de trabajo ni tercerización de personal — es un servicio de limpieza integral con equipo propio.
- No hay teléfono público. El primer contacto es por **mail**; recién cuando el prospecto está calificado, AZ continúa la conversación por **WhatsApp**.
- Hay un botón institucional (navbar + footer) separado del CTA comercial, que lleva al login del ERP interno: `azserviciosdelimpieza.com/login`.

---

## Reglas de diseño del sistema (obligatorias para todas las secciones)

- **Fondo único de toda la página (`--bg-claro: #EFEAF9`)**: sin alternancias de fondo claro en secciones normales (Hero, SocialProof, etc.).
- **Gama violeta / lila (usado en TODO excepto el CTA principal)**:
  - `--violeta-osc: #5B4E8A`: contraste fuerte (secciones "bloque fuerte"), botón de contacto/secundario sólido, cards sólidas sin borde — texto blanco encima.
  - `--lila-medio: #8B7BC7`: íconos, acentos secundarios, números de stats.
  - `--lila-suave: #C4B8E8`: bordes, hover suave (en bloques violeta-osc usar variante clara #E9E2F7).
  - `--lila-pastel: #E9E2F7`: fondos de badges, tags, pills informativas, cards claras con borde sutil.
- **Texto**: `--indigo-texto: #2B2640` (principal sobre fondo claro), `--texto-secundario: #6B6580` (secundario sobre fondo claro). Sobre fondo violeta-osc: texto blanco (#FFFFFF) y secundario #CECBF6.
- **CTA principal (ÚNICA excepción turquesa de todo el sitio)**: `--turq-cta: #3FA88F` y hover `--turq-cta-hover: #8FD4C2`. El turquesa no aparece en ningún otro lugar.
- **Burbujas decorativas** (`Bubble.astro`): siempre blancas/grises neutras transparentes (`--burbuja-blanca` / `--burbuja-gris`), nunca tintadas.
- **Gutter lateral único**: toda sección usa `.container-page` (`mx-auto max-w-[1440px] px-4 lg:px-10`, márgenes chicos estilo Freshify), definido en `global.css`.
- **Ritmo vertical entre secciones**: `py-14 lg:py-24` uniforme.
- **Reveal compartido**: elementos con `data-reveal` + clase `is-visible` vía IntersectionObserver.

---

## 1. Hero Section

**Fórmula aplicada:** Resultado final deseado + sin la fricción principal.

> ## Espacios impecables
> ### Equipo propio, turnos controlados por QR y GPS. Coordinás todo por un solo mail.

**CTA:** `Pedí tu presupuesto por mail →` *(abre el form de contacto, no un teléfono)*

**Layout (referencia Freshify, aprox. 200vh):** H1 gigante 2 líneas a la izquierda + 2 stat-pills (turq-pastel, ícono + valor bold violeta-osc + label chico) + columna copy/CTA a la derecha; debajo, foto ancho completo (acento central del hero, ~120vh) con esquinas redondeadas, SIN card de vidrio. Sin blancos: todo sobre bg-lila.

**Pills de estadísticas:**
- 50+ edificios cubiertos
- 98% de renovación de clientes

---

## 2. Quiénes somos / Social Proof

**Eyebrow:** `01 // Quiénes somos`

**Título de sección:** `Limpieza con control real, turno por turno`

**Cuerpo:**
Pensado para administradores de consorcios, oficinas y clínicas que necesitan saber qué pasó, no solo confiar en que pasó. Cada turno queda registrado con QR y GPS: no hace falta que un vecino o un empleado te avise si faltó alguien. El equipo es propio y los protocolos están documentados.

**Pills flotantes sobre imagen:**
- Equipo propio asegurado / Personal de AZ, no tercerizado
- Trazabilidad total / Cada turno, registrado con QR y GPS

---

## 3. Servicios

**Eyebrow:** `02 // Nuestros servicios`

**Título:** `Limpieza pensada para tu tipo de espacio`

1. **Limpieza de Oficinas y Empresas:** Programamos la limpieza según el ritmo de tu equipo: mantenimiento de puestos de trabajo, salas de reunión, office y sanitarios sin frenar tu jornada.
2. **Limpieza de Consorcios y Edificios:** Mantenimiento integral de áreas comunes: halls, escaleras, ascensores y cocheras. Cada turno queda registrado con QR y GPS.
3. **Clínicas y Centros de Salud:** Protocolos de desinfección e higiene para consultorios, salas de espera y áreas sensibles, con personal propio capacitado y reporte de cada turno.

---

## 4. Problem Statement

**Eyebrow:** `03 // El problema`

**Fórmula aplicada:** Mostrar el problema + hacer sentir su costo real.

> ## Contratás una empresa de limpieza y terminás gestionándola vos
>
> El personal falta y te enterás por un vecino que se quejó. No sabés si limpiaron los baños del segundo piso o solo pasaron por el hall. Cambiás de proveedor cada seis meses porque el anterior "dejó de responder". En una clínica, eso deja de ser una queja: se convierte en un problema de bioseguridad.

**Sub-bloque (filtro de nicho — "¿es para mí?"):**
- **Consorcios:** Administrás un consorcio y no tenés cómo comprobar si el turno se cumplió.
- **Oficinas:** Gestionás una oficina y la limpieza depende de que "alguien se acuerde" de avisar si faltó personal.
- **Clínicas:** Dirigís una clínica y necesitás protocolos de higiene documentados, no una promesa verbal.

---

## 5. Solution / Value

**Eyebrow:** `04 // Por qué elegirnos`

**Título de sección:** `Tanto control como el que vos ya exigís`

1. **Control de asistencia por QR y GPS:** Cada ingreso y salida del personal queda registrado con QR y GPS. Pedís el reporte cuando quieras, sin depender de que alguien te avise si faltó alguien.
2. **Personal propio, no tercerizado:** El equipo que limpia tu espacio es de AZ. Nada de subcontratistas de último momento ni caras nuevas cada semana.
3. **Protocolos por tipo de espacio:** Ajustamos frecuencia y protocolo según el tipo de espacio, porque un consorcio y una clínica no se limpian igual.
4. **Reportes de gestión, no promesas verbales:** Pedís el detalle de los turnos cumplidos, con horarios reales, cuando lo necesites. Así sabés qué se hizo y qué no.

---

## 6. How It Works

**Eyebrow:** `05 // Cómo funciona`

**Título de sección:** `Así arrancamos, en 3 pasos`

1. **Nos escribís por mail** — Contanos qué tipo de espacio tenés (consorcio, oficina o clínica) y qué necesitás resolver.
2. **Evaluamos tu caso** — Si encaja con lo que hacemos, te escribimos por WhatsApp para coordinar una visita.
3. **Arrancamos con seguimiento** — Con control de asistencia desde el primer turno.

---

## 7. FAQ's

**Eyebrow:** `06 // Preguntas frecuentes`

**Título de sección:** `Preguntas frecuentes`

- **¿Atienden hogares particulares?** No. Trabajamos exclusivamente con consorcios, oficinas y clínicas.
- **¿Cómo sé si el personal cumplió el turno?** Cada turno se registra con QR y GPS, y podés pedir el reporte de asistencia cuando quieras.
- **¿Puedo llamarlos por teléfono?** El contacto inicial es por mail. Una vez que evaluamos tu caso, seguimos la conversación por WhatsApp para coordinar todo más rápido.
- **¿El personal es de ustedes o tercerizado?** Es equipo propio de AZ.
- **¿Trabajan con protocolos específicos para clínicas?** Sí. Ajustamos frecuencia y protocolo de limpieza según el tipo de espacio y sus requisitos de higiene.
- **¿Qué pasa si no estoy conforme con el servicio?** Hacemos seguimiento activo después de arrancar y ajustamos frecuencia y protocolo según cómo funcione.

---

## 8. Final CTA & Footer

**Eyebrow wizard:** `07 // Contacto`

**CTA final:** `Pedí tu presupuesto por mail`

**Bio de marca:** AZ Limpieza. Servicio de limpieza profesional con equipo propio y asistencia controlada por QR y GPS. (Rosario, Santa Fe).
- Portal Institucional: Ingreso para el equipo de AZ. — Botón: Acceso empleados (`/login`).

---

## Pendientes para cerrar el copy al 100%

- [ ] Confirmar la casilla de mail real para reemplazar `[email de contacto]`.
- [x] Sumar el número real de edificios/oficinas/clínicas atendidas (confirmado: 50+ edificios, 98% renovación).
- [ ] Definir el label exacto del botón institucional (Acceso clientes / Portal AZ / Ingresar) y su estilo visual respecto al CTA comercial.
- [ ] Confirmar si "clínicas" requiere mención de alguna norma o protocolo específico que ya cumplan (sumaría mucho como diferenciador concreto).

---

## Notas de implementación (ajenas al copy — contexto del proyecto)

- Stack: Astro 7 + Tailwind v4 (CSS-first `@theme` en `src/styles/global.css`) + TypeScript strict + Content Collections (`src/content.config.ts`, colección `site` en `src/content/site/site.json`).
- Tokens de color en `src/styles/global.css`: `--bg-claro` (#EFEAF9), `--violeta-osc` (#5B4E8A), `--lila-medio` (#8B7BC7), `--lila-suave` (#C4B8E8), `--lila-pastel` (#E9E2F7), `--indigo-texto` (#2B2640), `--texto-secundario` (#6B6580), `--burbuja-blanca`, `--burbuja-gris`, y exclusivo para CTA: `--turq-cta` (#3FA88F) / `--turq-cta-hover` (#8FD4C2).
- Componentes UI: `src/components/ui/Bubble.astro`, `src/components/ui/Button.astro` y `src/components/ui/CtaRampButton.astro`.
- Navbar en `src/components/Navbar.astro` (estilo Freshify: logo izq, cápsula central sólida con links + íconos, contacto mail a la derecha; CTA comercial vive en el hero, no en el navbar).
- Regla de oro: NO inventar métricas, testimonios, datos de clientes ni contenido factual. Todo lo no confirmado se flaggea (usar los `[completar]` / pendientes de arriba).
- AZ no usa teléfono como contacto inicial — siempre mail; WhatsApp solo post-calificación.
- `referencias/` está en `.gitignore` (capturas locales de referencia visual, no van al repo).
