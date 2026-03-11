export type Lang = 'es' | 'en';

export const translations: Record<Lang, Record<string, string>> = {
  es: {
    // Nav
    'nav.about': 'Sobre mí',
    'nav.services': 'Servicios',
    'nav.products': 'Productos',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.toggleMenu': 'Abrir menú',

    // Hero
    'hero.tagline': 'Construyo productos digitales que escalan',
    'hero.cta.primary': 'Ver mis servicios',
    'hero.cta.secondary': 'Leer el blog',

    // About
    'about.title': 'Sobre mí',
    'about.tagline': 'Apasionado por construir soluciones que importan',
    'about.body':
      'Soy Ezequiel Benitez, desarrollador Full Stack con experiencia en el diseño y desarrollo de aplicaciones web, móviles y sistemas backend. Me especializo en transformar ideas en productos funcionales, escalables y con buena experiencia de usuario.',
    'about.techStack': 'Stack tecnológico',

    // Services
    'services.title': 'Servicios',
    'services.tagline': 'Soluciones reales para negocios reales',
    'services.subtitle': 'Trabajo con negocios que necesitan tecnología que funcione — no promesas vacías.',
    'services.web': 'Desarrollo Web',
    'services.web.problem': 'Tu web no aparece en Google o no convierte visitantes en clientes',
    'services.web.b1': 'Sitios rápidos con SEO técnico desde el primer día',
    'services.web.b2': 'Diseño que comunica y genera confianza',
    'services.web.b3': 'Integración directa con tus herramientas y flujos',
    'services.mobile': 'Apps Móviles',
    'services.mobile.problem': 'Tus clientes están en el celular pero no podés llegar a ellos',
    'services.mobile.b1': 'Una base de código para iOS y Android',
    'services.mobile.b2': 'UX pensada para retención y uso diario',
    'services.mobile.b3': 'Publicación en App Store y Google Play',
    'services.backend': 'Backend & APIs',
    'services.backend.problem': 'Tus sistemas no se comunican y el trabajo manual frena el crecimiento',
    'services.backend.b1': 'APIs REST robustas y bien documentadas',
    'services.backend.b2': 'Integración con pagos, CRM, logística y más',
    'services.backend.b3': 'Arquitectura que escala sin reescribir todo',
    'services.automation': 'Automatizaciones',
    'services.automation.problem': 'Perdés tiempo y plata en tareas que podrían correr solas',
    'services.automation.b1': 'Flujos automáticos entre sistemas que ya usás',
    'services.automation.b2': 'Reportes y alertas sin intervención manual',
    'services.automation.b3': 'Menos errores humanos, más capacidad de crecer',

    // Products
    'products.title': 'Productos',
    'products.tagline': 'Proyectos que construí y están en producción',
    'products.empty': 'Próximamente...',
    'products.empty.desc': 'Estoy preparando esta sección. Volvé pronto.',

    // Contact
    'contact.title': 'Contacto',
    'contact.tagline': '¿Tenés un proyecto en mente? Hablemos.',
    'contact.name': 'Nombre',
    'contact.name.placeholder': 'Tu nombre',
    'contact.email': 'Email',
    'contact.email.placeholder': 'tu@email.com',
    'contact.message': 'Mensaje',
    'contact.message.placeholder': 'Contame sobre tu proyecto...',
    'contact.send': 'Enviar mensaje',
    'contact.whatsapp': 'Escribir por WhatsApp',
    'contact.or': 'o',

    // Blog
    'blog.title': 'Blog',
    'blog.tagline': 'Tecnología, carrera y lo que aprendo en el camino',
    'blog.readMore': 'Leer más',
    'blog.noPosts': 'No hay posts aún. Volvé pronto.',
    'blog.backToBlog': '← Volver al blog',
    'blog.publishedOn': 'Publicado el',

    // Footer
    'footer.rights': 'Todos los derechos reservados.',
    'footer.madeWith': 'Hecho con',
    'footer.and': 'y',

    // Meta
    'site.title': 'Ezequiel Benitez — Full Stack Developer',
    'site.description':
      'Desarrollador Full Stack especializado en web, apps móviles, APIs y automatizaciones. Construyo productos digitales que escalan.',

    // Theme / Lang
    'theme.toggle': 'Cambiar tema',
    'lang.switch': 'Switch to English',
  },

  en: {
    // Nav
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.products': 'Products',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.toggleMenu': 'Open menu',

    // Hero
    'hero.tagline': 'I build digital products that scale',
    'hero.cta.primary': 'See my services',
    'hero.cta.secondary': 'Read the blog',

    // About
    'about.title': 'About me',
    'about.tagline': 'Passionate about building solutions that matter',
    'about.body':
      'I\'m Ezequiel Benitez, a Full Stack developer with experience designing and building web applications, mobile apps, and backend systems. I specialize in turning ideas into functional, scalable products with great user experience.',
    'about.techStack': 'Tech stack',

    // Services
    'services.title': 'Services',
    'services.tagline': 'Real solutions for real businesses',
    'services.subtitle': 'I work with businesses that need technology that actually works — not empty promises.',
    'services.web': 'Web Development',
    'services.web.problem': "Your website doesn't show up on Google or isn't converting visitors into customers",
    'services.web.b1': 'Fast sites with technical SEO from day one',
    'services.web.b2': 'Design that communicates and builds trust',
    'services.web.b3': 'Direct integration with your tools and workflows',
    'services.mobile': 'Mobile Apps',
    'services.mobile.problem': "Your customers are on mobile but you can't reach them",
    'services.mobile.b1': 'Single codebase for iOS and Android',
    'services.mobile.b2': 'UX built for retention and daily use',
    'services.mobile.b3': 'Published to App Store and Google Play',
    'services.backend': 'Backend & APIs',
    'services.backend.problem': "Your systems don't talk to each other and manual work is slowing your growth",
    'services.backend.b1': 'Robust, well-documented REST APIs',
    'services.backend.b2': 'Integrations with payments, CRM, logistics, and more',
    'services.backend.b3': 'Architecture that scales without rewriting everything',
    'services.automation': 'Automations',
    'services.automation.problem': "You're losing time and money on tasks that could run on their own",
    'services.automation.b1': 'Automatic flows between systems you already use',
    'services.automation.b2': 'Reports and alerts without manual intervention',
    'services.automation.b3': 'Fewer human errors, more room to grow',

    // Products
    'products.title': 'Products',
    'products.tagline': 'Projects I built that are live in production',
    'products.empty': 'Coming soon...',
    'products.empty.desc': "I'm preparing this section. Check back soon.",

    // Contact
    'contact.title': 'Contact',
    'contact.tagline': 'Have a project in mind? Let\'s talk.',
    'contact.name': 'Name',
    'contact.name.placeholder': 'Your name',
    'contact.email': 'Email',
    'contact.email.placeholder': 'you@email.com',
    'contact.message': 'Message',
    'contact.message.placeholder': 'Tell me about your project...',
    'contact.send': 'Send message',
    'contact.whatsapp': 'Chat on WhatsApp',
    'contact.or': 'or',

    // Blog
    'blog.title': 'Blog',
    'blog.tagline': 'Tech, career, and what I learn along the way',
    'blog.readMore': 'Read more',
    'blog.noPosts': 'No posts yet. Check back soon.',
    'blog.backToBlog': '← Back to blog',
    'blog.publishedOn': 'Published on',

    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.madeWith': 'Made with',
    'footer.and': 'and',

    // Meta
    'site.title': 'Ezequiel Benitez — Full Stack Developer',
    'site.description':
      'Full Stack developer specialized in web, mobile apps, APIs, and automations. I build digital products that scale.',

    // Theme / Lang
    'theme.toggle': 'Toggle theme',
    'lang.switch': 'Cambiar a español',
  },
};
