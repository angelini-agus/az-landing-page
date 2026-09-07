// Pure validation logic for the contact form (ContactSection.astro).
// Kept framework-free so it can be unit tested with Vitest.

export interface ContactFormValues {
  nombre: string;
  email: string;
  telefono: string;
  institucion: string;
  tipoEspacio: string;
}

export interface ContactFieldError {
  field: 'nombre' | 'email' | 'telefono' | 'institucion' | 'tipoEspacio';
  message: string;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 15;
}

export function validateStep1(tipoEspacio: string): ContactFieldError[] {
  if (!tipoEspacio?.trim()) {
    return [{ field: 'tipoEspacio', message: 'Seleccioná el tipo de espacio.' }];
  }
  return [];
}

export function validateStep2(values: {
  nombre: string;
  email: string;
  telefono: string;
  institucion: string;
}): ContactFieldError[] {
  const errors: ContactFieldError[] = [];

  if (!values.nombre?.trim()) {
    errors.push({ field: 'nombre', message: 'Ingresá tu nombre y apellido.' });
  }

  const email = values.email?.trim() ?? '';
  if (!email) {
    errors.push({ field: 'email', message: 'Ingresá tu email de contacto.' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'El email no tiene un formato válido.' });
  }

  const phone = values.telefono?.trim() ?? '';
  if (!phone) {
    errors.push({ field: 'telefono', message: 'Ingresá un número de teléfono o WhatsApp.' });
  } else if (!isValidPhone(phone)) {
    errors.push({ field: 'telefono', message: 'Ingresá un número de teléfono válido (mínimo 6 dígitos).' });
  }

  if (!values.institucion?.trim()) {
    errors.push({ field: 'institucion', message: 'Ingresá el nombre de tu institución o edificio.' });
  }

  return errors;
}

export function validateContactForm(values: ContactFormValues): ContactFieldError[] {
  const step1Errors = validateStep1(values.tipoEspacio);
  const step2Errors = validateStep2({
    nombre: values.nombre,
    email: values.email,
    telefono: values.telefono,
    institucion: values.institucion,
  });

  return [...step1Errors, ...step2Errors];
}