import { Link } from 'react-router-dom';
import { ArrowRight, Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import OptimizedImage from '@/components/common/OptimizedImage';

import ispManagerImg from '@/assets/products/isp-manager.jpg';
import somityAppImg from '@/assets/products/somity-app.jpg';
import restaurantAppImg from '@/assets/products/restaurant-app.jpg';

interface ProductData {
  slug: string;
  image: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  highlights: {
    en: string;
    bn: string;
  }[];
}

const products: ProductData[] = [
  {
    slug: 'isp-manager',
    image: ispManagerImg,
    titleEn: 'ISP Manager',
    titleBn: 'ISP ম্যানেজার',
    descriptionEn: 'AI-assisted ISP & network management platform for modern internet providers.',
    descriptionBn: 'আধুনিক ইন্টারনেট প্রদানকারীদের জন্য AI-সহায়তায় ISP ও নেটওয়ার্ক ম্যানেজমেন্ট প্ল্যাটফর্ম।',
    highlights: [
      { en: 'Subscriber & billing management', bn: 'সাবস্ক্রাইবার ও বিলিং ম্যানেজমেন্ট' },
      { en: 'Network & usage monitoring', bn: 'নেটওয়ার্ক ও ব্যবহার মনিটরিং' },
      { en: 'Automated reporting', bn: 'অটোমেটেড রিপোর্টিং' },
    ],
  },
  {
    slug: 'somity-app',
    image: somityAppImg,
    titleEn: 'Somity App',
    titleBn: 'সমিতি অ্যাপ',
    descriptionEn: 'Digital management solution for somity & cooperative organizations.',
    descriptionBn: 'সমিতি এবং সমবায় সংস্থাগুলির জন্য ডিজিটাল ম্যানেজমেন্ট সমাধান।',
    highlights: [
      { en: 'Member & savings tracking', bn: 'সদস্য ও সঞ্চয় ট্র্যাকিং' },
      { en: 'Automated calculations', bn: 'অটোমেটেড ক্যালকুলেশন' },
      { en: 'Secure data handling', bn: 'নিরাপদ ডেটা হ্যান্ডলিং' },
    ],
  },
  {
    slug: 'restaurant-app',
    image: restaurantAppImg,
    titleEn: 'Restaurant App',
    titleBn: 'রেস্তোরাঁ অ্যাপ',
    descriptionEn: 'Smart restaurant ordering, billing, and management system.',
    descriptionBn: 'স্মার্ট রেস্তোরাঁ অর্ডারিং, বিলিং এবং ম্যানেজমেন্ট সিস্টেম।',
    highlights: [
      { en: 'POS & order management', bn: 'POS ও অর্ডার ম্যানেজমেন্ট' },
      { en: 'Billing & reports', bn: 'বিলিং ও রিপোর্টস' },
      { en: 'Business analytics', bn: 'বিজনেস অ্যানালিটিক্স' },
    ],
  },
];

const ProductShowcase = () => {
  const { language } = useLanguage();

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <ScrollReveal>
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
              {language === 'en' ? 'Product Showcase' : 'প্রোডাক্ট শোকেস'}
            </span>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
              {language === 'en' ? 'Solutions Built for Growth' : 'বৃদ্ধির জন্য তৈরি সমাধান'}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-muted-foreground">
              {language === 'en'
                ? 'Enterprise-grade software designed to streamline operations and drive business success.'
                : 'এন্টারপ্রাইজ-গ্রেড সফটওয়্যার যা অপারেশন সুবিন্যস্ত করতে এবং ব্যবসায়িক সাফল্য চালাতে ডিজাইন করা হয়েছে।'}
            </p>
          </ScrollReveal>
        </div>

        {/* Products Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ScrollReveal key={product.slug} delay={200 + index * 100} animation="fade-in">
              <div className="group h-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                {/* Product Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <OptimizedImage
                    src={product.image}
                    alt={language === 'en' ? product.titleEn : product.titleBn}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Card Content */}
                <div className="flex flex-col p-6">
                  {/* Title */}
                  <h3 className="mb-2 text-xl font-bold text-foreground">
                    {language === 'en' ? product.titleEn : product.titleBn}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                    {language === 'en' ? product.descriptionEn : product.descriptionBn}
                  </p>

                  {/* Highlights */}
                  <ul className="mb-6 flex-1 space-y-2">
                    {product.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{language === 'en' ? highlight.en : highlight.bn}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="flex flex-col gap-3 lg:flex-row">
                    <Button asChild className="group/btn w-full lg:flex-1 transition-all duration-200 active:scale-[0.96]">
                      <Link to={`/products/${product.slug}`}>
                        {language === 'en' ? 'View Details' : 'বিস্তারিত দেখুন'}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full lg:flex-1 transition-all duration-200 active:scale-[0.96]">
                      <Link to="/contact?type=meeting">
                        <Play className="mr-2 h-4 w-4" />
                        {language === 'en' ? 'Request Demo' : 'ডেমো রিকোয়েস্ট'}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;