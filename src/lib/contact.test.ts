import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPhone, validateStep1, validateStep2, validateContactForm } from './contact';

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('admin@edificio.com')).toBe(true);
  });

  it('rejects missing @', () => {
    expect(isValidEmail('adminedificio.com')).toBe(false);
  });

  it('rejects missing domain', () => {
    expect(isValidEmail('admin@')).toBe(false);
  });

  it('rejects missing TLD', () => {
    expect(isValidEmail('admin@edificio')).toBe(false);
  });

  it('rejects whitespace padding', () => {
    expect(isValidEmail(' admin@edificio.com ')).toBe(false);
  });

  it('accepts a subdomain email', () => {
    expect(isValidEmail('contacto@sub.edificio.com')).toBe(true);
  });
});

describe('isValidPhone', () => {
  it('accepts valid phone numbers in different formats', () => {
    expect(isValidPhone('1123456789')).toBe(true);
    expect(isValidPhone('+54 9 11 2345-6789')).toBe(true);
    expect(isValidPhone('(011) 4567-8901')).toBe(true);
  });

  it('rejects numbers with fewer than 6 digits', () => {
    expect(isValidPhone('12345')).toBe(false);
    expect(isValidPhone('abc')).toBe(false);
  });
});

describe('validateStep1', () => {
  it('passes when space type is selected', () => {
    expect(validateStep1('consorcio')).toEqual([]);
  });

  it('fails when space type is empty', () => {
    expect(validateStep1('')).toContainEqual({
      field: 'tipoEspacio',
      message: 'Seleccioná el tipo de espacio.',
    });
  });
});

describe('validateStep2', () => {
  const valid = {
    nombre: 'Juan Pérez',
    email: 'admin@edificio.com',
    telefono: '1123456789',
    institucion: 'Consorcio Av. Libertador 1400',
  };

  it('returns no errors for valid step 2 values', () => {
    expect(validateStep2(valid)).toEqual([]);
  });

  it('flags missing telefono', () => {
    const errors = validateStep2({ ...valid, telefono: '' });
    expect(errors).toContainEqual({
      field: 'telefono',
      message: 'Ingresá un número de teléfono o WhatsApp.',
    });
  });

  it('flags invalid telefono', () => {
    const errors = validateStep2({ ...valid, telefono: '123' });
    expect(errors).toContainEqual({
      field: 'telefono',
      message: 'Ingresá un número de teléfono válido (mínimo 6 dígitos).',
    });
  });
});

describe('validateContactForm', () => {
  const valid = {
    nombre: 'Juan Pérez',
    email: 'admin@edificio.com',
    telefono: '1123456789',
    institucion: 'Consorcio Av. Libertador 1400',
    tipoEspacio: 'consorcio',
  };

  it('returns no errors for a fully valid form', () => {
    expect(validateContactForm(valid)).toEqual([]);
  });

  it('flags an empty nombre', () => {
    const errors = validateContactForm({ ...valid, nombre: '   ' });
    expect(errors).toContainEqual({ field: 'nombre', message: 'Ingresá tu nombre y apellido.' });
  });

  it('flags an empty email', () => {
    const errors = validateContactForm({ ...valid, email: '' });
    expect(errors).toContainEqual({ field: 'email', message: 'Ingresá tu email de contacto.' });
  });

  it('flags a malformed email', () => {
    const errors = validateContactForm({ ...valid, email: 'no-es-un-mail' });
    expect(errors).toContainEqual({ field: 'email', message: 'El email no tiene un formato válido.' });
  });

  it('flags an empty institucion', () => {
    const errors = validateContactForm({ ...valid, institucion: '' });
    expect(errors).toContainEqual({ field: 'institucion', message: 'Ingresá el nombre de tu institución o edificio.' });
  });

  it('flags a missing tipoEspacio', () => {
    const errors = validateContactForm({ ...valid, tipoEspacio: '' });
    expect(errors).toContainEqual({ field: 'tipoEspacio', message: 'Seleccioná el tipo de espacio.' });
  });

  it('returns every error when all fields are invalid', () => {
    const errors = validateContactForm({
      nombre: '',
      email: 'mal',
      telefono: '',
      institucion: '',
      tipoEspacio: '',
    });
    expect(errors).toHaveLength(5);
    expect(errors.map((e) => e.field)).toEqual(['tipoEspacio', 'nombre', 'email', 'telefono', 'institucion']);
  });
});