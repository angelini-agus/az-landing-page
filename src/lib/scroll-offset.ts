// Pure scroll-offset calculation for navbar anchor navigation (Navbar.astro).
// Kept framework-free so it can be unit tested with Vitest.

export type SectionHref =
  | '#quienes-somos'
  | '#servicios'
  | '#el-problema'
  | '#como-funciona'
  | '#faq'
  | '#contacto';

/**
 * Base landing offset per section:
 * - "Funcionamiento" (#como-funciona): 0 (user confirmed it is perfect)
 * - Everything else: -44px midpoint offset
 */
export function getBaseSectionOffset(href: string): number {
  return href === '#como-funciona' ? 0 : -44;
}

export interface ContactOffsetInput {
  hasBanner: boolean;
  bannerRelativeTop: number;
  navbarTop: number;
}

/**
 * Offset for the #contacto section:
 * aligns the top of the purple banner with the top of the navbar,
 * plus 20px extra scroll depth (leaves viewport 20px further down).
 * Falls back to +88px when no banner element is found (68 + 20).
 */
export function getContactSectionOffset({ hasBanner, bannerRelativeTop, navbarTop }: ContactOffsetInput): number {
  if (hasBanner) {
    return bannerRelativeTop - navbarTop + 20;
  }
  return 88;
}

/** Resolve the final scroll offset for any internal anchor. */
export function resolveSectionOffset(href: string, contact?: ContactOffsetInput): number {
  if (href === '#contacto' && contact) {
    return getContactSectionOffset(contact);
  }
  return getBaseSectionOffset(href);
}