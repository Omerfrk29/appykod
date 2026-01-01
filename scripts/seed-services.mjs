import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const seedServices = [
  {
    id: 'web',
    title: { tr: 'Web Geliştirme', en: 'Web Development' },
    description: {
      tr: 'Modern web teknolojileri ile hızlı, güvenli ve ölçeklenebilir web uygulamaları geliştiriyoruz. Next.js, React ve Node.js ile tam kapsamlı çözümler.',
      en: 'We develop fast, secure, and scalable web applications with modern web technologies. Full-stack solutions with Next.js, React, and Node.js.'
    },
    icon: 'Globe',
  },
  {
    id: 'mobile',
    title: { tr: 'Mobil Uygulama', en: 'Mobile App' },
    description: {
      tr: 'iOS ve Android için native performanslı, kullanıcı dostu mobil uygulamalar.',
      en: 'Native performance mobile applications for iOS and Android with user-friendly interfaces.'
    },
    icon: 'Smartphone',
  },
  {
    id: 'uxui',
    title: { tr: 'UI/UX Tasarım', en: 'UI/UX Design' },
    description: {
      tr: 'Kullanıcı deneyimini ön plana alan, modern ve şık arayüz tasarımları.',
      en: 'Modern and elegant interface designs that prioritize user experience.'
    },
    icon: 'Palette',
  },
  {
    id: 'backend',
    title: { tr: 'Backend Sistemler', en: 'Backend Systems' },
    description: {
      tr: 'Güçlü ve güvenilir API\'lar, veritabanı tasarımı ve sunucu altyapısı.',
      en: 'Powerful and reliable APIs, database design, and server infrastructure.'
    },
    icon: 'Database',
  },
  {
    id: 'security',
    title: { tr: 'Güvenlik Danışmanlığı', en: 'Security Consulting' },
    description: {
      tr: 'Penetrasyon testleri, güvenlik denetimleri ve en iyi güvenlik uygulamaları.',
      en: 'Penetration testing, security audits, and best security practices.'
    },
    icon: 'Shield',
  }
];

async function seedDatabase() {
  const dbPath = path.join(__dirname, '..', 'data.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  if (data.services.length === 0) {
    data.services = seedServices;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    console.log('Services seeded successfully!');
  } else {
    console.log('Services already exist, skipping seed.');
  }
}

seedDatabase();
