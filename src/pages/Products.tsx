import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductHero from '@/components/products/ProductHero';
import ProductOverview from '@/components/products/ProductOverview';
import ProductFeatures from '@/components/products/ProductFeatures';
import ProductHowItWorks from '@/components/products/ProductHowItWorks';
import ProductTechnology from '@/components/products/ProductTechnology';
import ProductCTA from '@/components/products/ProductCTA';

const Products = () => {
  const { language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>
          {language === 'en'
            ? 'Our Products - Creation Tech'
            : 'আমাদের প্রোডাক্টস - Creation Tech'}
        </title>
        <meta
          name="description"
          content={
            language === 'en'
              ? 'Discover our cutting-edge technology products designed to transform your business with automation, analytics, and cloud solutions.'
              : 'আমাদের অত্যাধুনিক প্রযুক্তি পণ্যগুলি আবিষ্কার করুন যা অটোমেশন, অ্যানালিটিক্স এবং ক্লাউড সলিউশন দিয়ে আপনার ব্যবসাকে রূপান্তরিত করতে পারে।'
          }
        />
      </Helmet>
      <Layout>
        <ProductHero />
        <ProductOverview />
        <ProductFeatures />
        <ProductHowItWorks />
        <ProductTechnology />
        <ProductCTA />
      </Layout>
    </>
  );
};

export default Products;
