import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import ProductsSection from '@/components/home/ProductsSection';
import IndustriesSection from '@/components/home/IndustriesSection';
import TrustIndicators from '@/components/home/TrustIndicators';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import DevelopmentProcessSection from '@/components/home/DevelopmentProcessSection';
import PartnersSection from '@/components/home/PartnersSection';
import CTASection from '@/components/home/CTASection';
import PortfolioSection from '@/components/home/PortfolioSection';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Software Development Company in Bangladesh | Creation Tech</title>
        <meta
          name="description"
          content="Creation Tech is a leading software development company in Bangladesh offering custom software development, AI solutions, mobile apps, and enterprise technology services."
        />
        <meta
          name="keywords"
          content="software development company Bangladesh, custom software development, IT company Bangladesh, technology solutions, AI software development"
        />
        <link rel="canonical" href="https://creationtechbd.com" />
      </Helmet>
      <Layout>
        <HeroSection />
        <PartnersSection />
        <ServicesSection />
        <ProductsSection />
        <PortfolioSection limit={3} showViewAll className="bg-muted/30" />
        <IndustriesSection />
        <TrustIndicators />
        <DevelopmentProcessSection />
        <TestimonialsSection />
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
