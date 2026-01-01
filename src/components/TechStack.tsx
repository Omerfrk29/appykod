'use client';

const technologies = [
  // Frontend Frameworks & Libraries
  'React',
  'Next.js',
  'Vue.js',
  'Angular',
  'Svelte',
  'Nuxt.js',
  'Remix',
  'Astro',
  // Languages
  'TypeScript',
  'JavaScript',
  'HTML5',
  'CSS3',
  'Python',
  'Java',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  // Backend & Runtime
  'Node.js',
  'Express.js',
  'NestJS',
  'Fastify',
  'Django',
  'Flask',
  'Laravel',
  'Ruby on Rails',
  'Spring Boot',
  // Styling & UI
  'Tailwind CSS',
  'Bootstrap',
  'Material-UI',
  'Chakra UI',
  'Styled Components',
  'Sass',
  'Less',
  'CSS Modules',
  // Databases
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'SQLite',
  'MariaDB',
  'SQL Server',
  'Oracle',
  'Firebase',
  'Supabase',
  // Cloud & DevOps
  'AWS',
  'Azure',
  'Google Cloud',
  'Vercel',
  'Netlify',
  'Heroku',
  'Docker',
  'Kubernetes',
  'Git',
  'GitHub',
  'GitLab',
  // Microsoft Stack
  '.NET',
  'C#',
  'Windows Server',
  'ASP.NET',
  // Mobile
  'React Native',
  'Flutter',
  'Ionic',
  // Tools & Build
  'Webpack',
  'Vite',
  'Babel',
  'ESLint',
  'Prettier',
  'Jest',
  'Cypress',
  'Storybook',
  // APIs & Protocols
  'GraphQL',
  'REST API',
  'WebSocket',
  'gRPC',
  // Design & Prototyping
  'Figma',
  'Adobe XD',
  'Sketch',
  // Other
  'PWA',
  'SEO',
  'WebAssembly',
  'Microservices',
];

export default function TechStack() {
  return (
    <section className="py-16 bg-[#0F1117] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-[0.2em] mb-10">
          Powered by modern technologies
        </p>

        <div className="relative overflow-hidden">
          {/* Sol gradient overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0F1117] to-transparent z-10 pointer-events-none" />
          
          {/* Sağ gradient overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0F1117] to-transparent z-10 pointer-events-none" />

          <div className="group">
            <div className="flex gap-12 w-fit animate-tech-slide">
              {[...technologies, ...technologies].map((tech, index) => (
                <div
                  key={`${tech}-${index}`}
                  className="text-lg md:text-xl font-semibold text-gray-600 group-hover:text-white transition-colors duration-300 cursor-default whitespace-nowrap"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
