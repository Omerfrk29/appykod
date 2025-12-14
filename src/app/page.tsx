import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TechStack from '@/components/TechStack';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';
import type { Service, Project } from '@/lib/db';

// Lazy load heavy components that are below the fold
const Process = dynamic(() => import('@/components/Process'), {
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

const Testimonials = dynamic(() => import('@/components/Testimonials'), {
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

const CTA = dynamic(() => import('@/components/CTA'), {
  loading: () => (
    <div className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-48 bg-primary/20 rounded-3xl animate-pulse" />
      </div>
    </div>
  ),
});

const Contact = dynamic(() => import('@/components/Contact'), {
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
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/services`, {
      cache: 'no-store', // Always fetch fresh data
    });
    if (!res.ok) {
      console.error('Failed to fetch services:', res.statusText);
      return [];
    }
    const data = await res.json();
    return data.success && data.data ? data.data : [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

async function fetchProjects(): Promise<Project[]> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/projects`, {
      cache: 'no-store', // Always fetch fresh data
    });
    if (!res.ok) {
      console.error('Failed to fetch projects:', res.statusText);
      return [];
    }
    const data = await res.json();
    return data.success && data.data ? data.data : [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function Home() {
  const [services, projects] = await Promise.all([
    fetchServices(),
    fetchProjects(),
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
