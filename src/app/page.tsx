import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TechStack from '@/components/TechStack';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { getDB } from '@/lib/db';

export default function Home() {
  const db = getDB();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TechStack />
        <Services services={db.services} />
        <Process />
        <Projects projects={db.projects} />
        <Testimonials />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
