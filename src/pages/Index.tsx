import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import TrustIndicators from '@/components/home/TrustIndicators';
import PartnersSection from '@/components/home/PartnersSection';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Creation Tech - Innovative IT Solutions for Business Growth</title>
        <meta
          name="description"
          content="Creation Tech delivers innovative IT solutions including web development, mobile apps, cloud solutions, and cybersecurity services to help businesses grow and succeed."
        />
        <meta
          name="keywords"
          content="IT solutions, web development, mobile apps, cloud solutions, cybersecurity, Bangladesh, Dhaka"
        />
        <link rel="canonical" href="https://creationtech.com" />
      </Helmet>
      <Layout>
        <HeroSection />
        <PartnersSection />
        <ServicesSection />
        <TrustIndicators />
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
