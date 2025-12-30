import dynamicImport from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TechStack from '@/components/TechStack';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';
import SnowEffect from '@/components/SnowEffect';
import type { Service, Project } from '@/lib/db';
import * as serviceService from '@/lib/services/serviceService';
import * as projectService from '@/lib/services/projectService';
import * as settingsService from '@/lib/services/settingsService';

// Force dynamic rendering to avoid build-time MongoDB connection issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Lazy load heavy components that are below the fold
const Process = dynamicImport(() => import('@/components/Process'), {
  loading: () => (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mx-auto mb-8" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  ),
});

const Testimonials = dynamicImport(() => import('@/components/Testimonials'), {
  loading: () => (
    <div className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mx-auto mb-16" />
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  ),
});

const CTA = dynamicImport(() => import('@/components/CTA'), {
  loading: () => (
    <div className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-48 bg-primary/20 rounded-3xl animate-pulse" />
      </div>
    </div>
  ),
});

const Contact = dynamicImport(() => import('@/components/Contact'), {
  loading: () => (
    <div className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 animate-pulse">
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
            <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
        </div>
      </div>
    </div>
  ),
});

async function fetchServices(): Promise<Service[]> {
  try {
    // Directly use MongoDB service instead of API fetch
    const services = await serviceService.getAllServices();
    console.log(`[page.tsx] Fetched ${services.length} services from MongoDB`);
    return services;
  } catch (error) {
    console.error('[page.tsx] Error fetching services:', error);
    if (error instanceof Error) {
      console.error('[page.tsx] Error details:', error.message, error.stack);
    }
    return [];
  }
}

async function fetchProjects(): Promise<Project[]> {
  try {
    // Directly use MongoDB service instead of API fetch
    const projects = await projectService.getAllProjects();
    console.log(`[page.tsx] Fetched ${projects.length} projects from MongoDB`);
    return projects;
  } catch (error) {
    console.error('[page.tsx] Error fetching projects:', error);
    if (error instanceof Error) {
      console.error('[page.tsx] Error details:', error.message, error.stack);
    }
    return [];
  }
}

export default async function Home() {
  const [services, projects, settings] = await Promise.all([
    fetchServices(),
    fetchProjects(),
    settingsService.getSettings(),
  ]);

  const isHolidayThemeEnabled = settings.holidayTheme?.enabled ?? false;

  return (
    <>
      {isHolidayThemeEnabled && <SnowEffect />}
      <Navbar />
      <main>
        <Hero />
        <TechStack />
        <Services services={services} />
        <Projects projects={projects} />
        <Process />
        <Testimonials />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
