#!/usr/bin/env node

/**
 * Migration script to convert existing data.json to multilingual format.
 * Run with: node scripts/migrate-to-multilang.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '..', 'data.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data.backup.json');

// English translations for existing Turkish content
const englishTranslations = {
  services: {
    'web-development': {
      title: 'Web Development',
      description: 'Modern, responsive and SEO-friendly websites.',
      fullDescription: 'We develop modern, fast, and user-friendly websites for your business using the latest technologies. We create SEO-friendly, mobile-first designs using Next.js, React, and TypeScript.\n\nOur websites are focused on high performance, security, and scalability. We offer custom solutions for e-commerce, corporate websites, blog platforms, and more.',
      features: [
        'Responsive and mobile-first design',
        'SEO optimization',
        'Fast page load times',
        'Secure SSL certificate',
        'Content Management System (CMS) integration',
        'Analytics and performance tracking',
        '24/7 technical support'
      ],
      faq: [
        {
          question: 'How long does it take to build a website?',
          answer: 'It varies from 2-8 weeks depending on the project scope. Simple corporate sites are completed in 2-3 weeks, while complex e-commerce platforms take 6-8 weeks.'
        },
        {
          question: 'What technologies do you use?',
          answer: 'We use Next.js, React, TypeScript, Tailwind CSS, Node.js, and modern database solutions. We select the most suitable technology for each project.'
        },
        {
          question: 'Is hosting and domain included?',
          answer: 'We also offer hosting and domain services optionally. We can host on Vercel, AWS, or your preferred platform.'
        }
      ]
    },
    'mobile-apps': {
      title: 'Mobile Apps',
      description: 'Native and cross-platform applications for iOS and Android.',
      fullDescription: 'We develop high-performance mobile applications that work on both iOS and Android platforms using React Native and Flutter.\n\nWe create applications that deliver native performance on both platforms with a single codebase. Push notifications, offline functionality, device sensor integration, and more.',
      features: [
        'Cross-platform development (iOS & Android)',
        'Native performance',
        'Push notifications',
        'Offline support',
        'App Store and Play Store publishing',
        'User analytics',
        'Continuous updates and maintenance'
      ],
      faq: [
        {
          question: 'Does the app work on both iOS and Android?',
          answer: 'Yes, we develop applications that work on both platforms with a single codebase using React Native or Flutter.'
        },
        {
          question: 'Is app store submission included?',
          answer: 'Yes, we manage the submission processes to the App Store and Google Play Store on your behalf.'
        },
        {
          question: 'How are app updates handled?',
          answer: 'We provide regular updates and new feature additions as part of our maintenance packages.'
        }
      ]
    },
    'custom-software': {
      title: 'Custom Software',
      description: 'Tailored software solutions and systems for your business.',
      fullDescription: 'We develop custom software solutions designed according to your business\'s unique needs. ERP systems, CRM applications, automation tools, and more.\n\nWe offer scalable and secure software solutions that work integrated with your existing systems. Optimize your business processes and increase your efficiency.',
      features: [
        'Custom design for business processes',
        'Integration with existing systems',
        'API development',
        'Database design and optimization',
        'Cloud-based solutions',
        'Security and authorization',
        'Detailed documentation and training'
      ],
      faq: [
        {
          question: 'Can it integrate with our existing systems?',
          answer: 'Yes, we provide integration with your existing ERP, CRM, or other systems via API.'
        },
        {
          question: 'Will we own the source code?',
          answer: 'Yes, upon project completion, all source code and documentation will be delivered to you.'
        },
        {
          question: 'Is training and support included?',
          answer: 'Yes, user training and technical support for a certain period are included in all our projects.'
        }
      ]
    }
  },
  projects: {
    'ecommerce-platform': {
      title: 'E-Commerce Platform',
      description: 'Full-featured online store with payment integration.',
      fullDescription: 'This e-commerce platform developed for one of Turkey\'s leading textile brands serves over 100,000 visitors per month.\n\nThe platform is equipped with advanced filtering, real-time stock tracking, multiple payment options, and shipping integrations. Thanks to its mobile-friendly design, 60% of sales come from mobile devices.',
      challenges: 'Performance issues during high traffic periods (campaign days) and stock synchronization were the biggest challenges. Integration with the existing ERP system was also a complex process.',
      solutions: 'We optimized performance using Redis-based caching and CDN. We established WebSocket connections for real-time stock synchronization. We developed a custom API gateway for ERP integration.'
    },
    'finance-dashboard': {
      title: 'Finance Dashboard',
      description: 'Real-time analytics and reporting tools.',
      fullDescription: 'This dashboard developed for a fintech company provides real-time tracking and analysis of financial data.\n\nUsers can access income-expense tracking, cash flow analysis, budget planning, and forecasting tools from a single platform. Automatic report generation and email notifications have automated business processes.',
      challenges: 'Real-time visualization of large data sets and combining data from different data sources were the main challenges.',
      solutions: 'We used D3.js optimized charts and data virtualization techniques. We aggregated different data sources into a single API using microservice architecture.'
    },
    'social-app': {
      title: 'Social Media App',
      description: 'Community platform with messaging features.',
      fullDescription: 'This social media application developed for hobby groups enables users to create groups based on their interests and interact.\n\nWe enriched the user experience with real-time messaging, event creation, photo/video sharing, and notification system. It has a 4.8 star rating on the App Store and Play Store.',
      challenges: 'Ensuring low latency in real-time messaging and fast loading of media files were the biggest challenges.',
      solutions: 'We built instant messaging infrastructure using Firebase Realtime Database and Cloud Functions. We implemented CDN and progressive loading for media files.'
    }
  }
};

function migrateService(service) {
  const enData = englishTranslations.services[service.id] || {};
  
  return {
    id: service.id,
    title: {
      tr: service.title,
      en: enData.title || service.title
    },
    description: {
      tr: service.description,
      en: enData.description || service.description
    },
    icon: service.icon,
    fullDescription: service.fullDescription ? {
      tr: service.fullDescription,
      en: enData.fullDescription || service.fullDescription
    } : undefined,
    features: service.features ? service.features.map((f, i) => ({
      tr: f,
      en: enData.features?.[i] || f
    })) : undefined,
    gallery: service.gallery,
    faq: service.faq ? service.faq.map((item, i) => ({
      question: {
        tr: item.question,
        en: enData.faq?.[i]?.question || item.question
      },
      answer: {
        tr: item.answer,
        en: enData.faq?.[i]?.answer || item.answer
      }
    })) : undefined,
    pricing: service.pricing
  };
}

function migrateProject(project) {
  const enData = englishTranslations.projects[project.id] || {};
  
  return {
    id: project.id,
    title: {
      tr: project.title,
      en: enData.title || project.title
    },
    description: {
      tr: project.description,
      en: enData.description || project.description
    },
    imageUrl: project.imageUrl,
    link: project.link,
    fullDescription: project.fullDescription ? {
      tr: project.fullDescription,
      en: enData.fullDescription || project.fullDescription
    } : undefined,
    technologies: project.technologies,
    challenges: project.challenges ? {
      tr: project.challenges,
      en: enData.challenges || project.challenges
    } : undefined,
    solutions: project.solutions ? {
      tr: project.solutions,
      en: enData.solutions || project.solutions
    } : undefined,
    gallery: project.gallery
  };
}

async function migrate() {
  console.log('Starting migration...');
  
  // Read current data
  let data;
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    data = JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read data.json:', error);
    process.exit(1);
  }

  // Check if already migrated (title is an object)
  if (data.services?.[0]?.title && typeof data.services[0].title === 'object') {
    console.log('Data already migrated. Skipping...');
    return;
  }

  // Backup original data
  console.log('Creating backup at data.backup.json...');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(data, null, 2));

  // Migrate services
  console.log('Migrating services...');
  const migratedServices = data.services.map(migrateService);

  // Migrate projects
  console.log('Migrating projects...');
  const migratedProjects = data.projects.map(migrateProject);

  // Create new data structure
  const newData = {
    services: migratedServices,
    projects: migratedProjects,
    messages: data.messages || [],
    settings: {
      siteName: { tr: 'Appykod', en: 'Appykod' },
      siteDescription: { 
        tr: 'Dijital çözümler', 
        en: 'Digital solutions' 
      },
      logo: '/logos/Appy_white.svg',
      contact: {
        phone: '+90 555 123 4567',
        email: 'info@appykod.com',
        address: { 
          tr: 'İstanbul, Türkiye', 
          en: 'Istanbul, Turkey' 
        }
      },
      social: {}
    }
  };

  // Write migrated data
  console.log('Writing migrated data...');
  fs.writeFileSync(DATA_PATH, JSON.stringify(newData, null, 2));

  console.log('Migration completed successfully!');
  console.log(`- ${migratedServices.length} services migrated`);
  console.log(`- ${migratedProjects.length} projects migrated`);
  console.log('- Backup saved to data.backup.json');
}

migrate().catch(console.error);

