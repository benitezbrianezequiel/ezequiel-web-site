export const SITE_CONFIG = {
  name: 'Ezequiel Benitez',
  role: 'Full Stack Developer',
  // Reemplazar con tu número en formato internacional (sin + ni espacios)
  // Ejemplo: '5491112345678' para Argentina (+54 9 11 1234-5678)
  whatsappNumber: 'TU_NUMERO_AQUI',
  whatsappMessage: 'Hola Ezequiel, me gustaría hablar sobre un proyecto.',
  github: 'https://github.com/EzeT4ch',
  // Reemplazar con tu URL real de LinkedIn
  linkedin: 'https://linkedin.com/in/ezequiel-benitez',
  // Reemplazar con tu email real
  email: 'hola@ezequielbenitez.com',
} as const;

export type SiteConfig = typeof SITE_CONFIG;
