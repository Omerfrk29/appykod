import dynamicImport from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TechStack from '@/components/TechStack';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';
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
    <div className="py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 animate-pulse">
        <div className="h-10 bg-muted rounded w-1/3 mx-auto mb-8" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  ),
});

const Testimonials = dynamicImport(() => import('@/components/Testimonials'), {
  loading: () => (
    <div className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 animate-pulse">
        <div className="h-10 bg-muted rounded w-1/4 mx-auto mb-16" />
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted/50 rounded-2xl" />
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
    <div className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 animate-pulse">
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded w-2/3" />
            <div className="h-24 bg-muted rounded" />
          </div>
          <div className="h-96 bg-muted rounded-3xl" />
        </div>
      </div>
    </div>
  ),
});

async function fetchServices(): Promise<Service[]> {
  try {
    const services = await serviceService.getAllServices();
    return services;
  } catch (error) {
    console.error('[page.tsx] Error fetching services:', error);
    return [];
  }
}

async function fetchProjects(): Promise<Project[]> {
  try {
    const projects = await projectService.getAllProjects();
    return projects;
  } catch (error) {
    console.error('[page.tsx] Error fetching projects:', error);
    return [];
  }
}

export default async function Home() {
  const [services, projects] = await Promise.all([
    fetchServices(),
    fetchProjects(),
    settingsService.getSettings(), // Keeping the call to cache settings if needed, but not using it for holiday theme
  ]);

  return (
    <>
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