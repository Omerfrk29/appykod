'use client';

const technologies = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#ffffff' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js', color: '#47CF86' },
  { name: 'Tailwind CSS', color: '#00CED1' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'Figma', color: '#F24E1E' },
];

export default function TechStack() {
  return (
    <section className="py-16 bg-[#0F1117] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-[0.2em] mb-10">
          Powered by modern technologies
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="text-lg md:text-xl font-semibold text-gray-600 hover:text-white transition-colors duration-300 cursor-default"
            >
              {tech.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
