'use client';

import HeroSection from '@/components/HeroSection';
import TrustPanel from '@/components/TrustPanel';
import FeaturedCollections from '@/components/FeaturedCollections';
import BestSellers from '@/components/BestSellers';
import NewsletterSection from '@/components/NewsletterSection';

const HomeView = () => {
  return (
    <>
      <HeroSection />
      <TrustPanel />
      <FeaturedCollections />
      <BestSellers />
      <NewsletterSection />
    </>
  );
};

export default HomeView;
