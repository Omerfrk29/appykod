import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PrivacyContent from './PrivacyContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'AppyKod gizlilik politikası ve kişisel verilerin korunması hakkında bilgiler.',
  openGraph: {
    title: 'Gizlilik Politikası | AppyKod',
    description: 'AppyKod gizlilik politikası ve kişisel verilerin korunması hakkında bilgiler.',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <PrivacyContent />
      </main>
      <Footer />
    </>
  );
}

