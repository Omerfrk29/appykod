import dynamicImport from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TechStack from '@/components/TechStack';
import Services from '@/components/Services';
import FeaturedProducts from '@/components/FeaturedProducts';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';
import * as settingsService from '@/lib/services/settingsService';

// Force dynamic rendering to avoid build-time MongoDB connection issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Lazy load heavy components that are below the fold
const Process = dynamicImport(() => import('@/components/Process'), {
  loading: () => (
    <div className="py-24 bg-[#0F1117]">
      <div className="max-w-7xl mx-auto px-4 animate-pulse">
        <div className="h-10 bg-white/5 rounded w-1/3 mx-auto mb-8" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  ),
});

const Testimonials = dynamicImport(() => import('@/components/Testimonials'), {
  loading: () => (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4 mx-auto mb-16" />
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  ),
});

const Contact = dynamicImport(() => import('@/components/Contact'), {
  loading: () => (
    <div className="py-24 bg-[#0F1117]">
      <div className="max-w-7xl mx-auto px-4 animate-pulse">
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="h-10 bg-white/5 rounded w-2/3" />
            <div className="h-24 bg-white/5 rounded" />
          </div>
          <div className="h-96 bg-white/5 rounded-3xl" />
        </div>
      </div>
    </div>
  ),
});

export default async function Home() {
  const settings = await settingsService.getSettings();

  // Holiday theme temporarily disabled for new design
  const isHolidayThemeEnabled = false;

  return (
    <>
      <Navbar isHolidayTheme={isHolidayThemeEnabled} />
      <main>
        <Hero />
        <TechStack />
        <Services />
        <FeaturedProducts />
        <Projects />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
