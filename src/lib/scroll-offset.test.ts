import { describe, it, expect } from 'vitest';
import { getBaseSectionOffset, getContactSectionOffset, resolveSectionOffset } from './scroll-offset';

describe('getBaseSectionOffset', () => {
  it('uses offset 0 for #como-funciona', () => {
    expect(getBaseSectionOffset('#como-funciona')).toBe(0);
  });

  it('uses -44 for every other section', () => {
    for (const href of ['#quienes-somos', '#servicios', '#el-problema', '#faq']) {
      expect(getBaseSectionOffset(href)).toBe(-44);
    }
  });
});

describe('getContactSectionOffset', () => {
  it('aligns the banner top with the navbar top plus 20px depth', () => {
    expect(getContactSectionOffset({ hasBanner: true, bannerRelativeTop: 300, navbarTop: 24 })).toBe(296);
  });

  it('falls back to +88 when there is no banner', () => {
    expect(getContactSectionOffset({ hasBanner: false, bannerRelativeTop: 0, navbarTop: 24 })).toBe(88);
  });

  it('handles a navbar above the banner (negative offset) plus 20px', () => {
    expect(getContactSectionOffset({ hasBanner: true, bannerRelativeTop: 400, navbarTop: 500 })).toBe(-80);
  });
});

describe('resolveSectionOffset', () => {
  it('returns base offset for non-contact sections', () => {
    expect(resolveSectionOffset('#faq')).toBe(-44);
    expect(resolveSectionOffset('#como-funciona')).toBe(0);
  });

  it('returns the contact offset for #contacto when contact input is provided', () => {
    expect(
      resolveSectionOffset('#contacto', { hasBanner: true, bannerRelativeTop: 250, navbarTop: 24 }),
    ).toBe(246);
  });

  it('returns the base offset for #contacto when no contact input is given', () => {
    expect(resolveSectionOffset('#contacto')).toBe(-44);
  });
});