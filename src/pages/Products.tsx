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
            ? 'Business Management Software Solutions | Creation Tech'
            : 'বিজনেস ম্যানেজমেন্ট সফটওয়্যার সমাধান | Creation Tech'}
        </title>
        <meta
          name="description"
          content={
            language === 'en'
              ? 'Explore our business management software solutions including ISP management software, cooperative management system, and restaurant management software for enterprise automation.'
              : 'আমাদের বিজনেস ম্যানেজমেন্ট সফটওয়্যার সমাধান দেখুন - ISP ম্যানেজমেন্ট, সমবায় ম্যানেজমেন্ট সিস্টেম, এবং রেস্তোরাঁ ম্যানেজমেন্ট সফটওয়্যার।'
          }
        />
        <meta name="keywords" content="business management software, ISP management software, cooperative management system, restaurant management software" />
        <link rel="canonical" href="https://creationtechbd.com/products" />
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
