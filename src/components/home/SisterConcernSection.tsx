import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';

import chostLogo from '@/assets/sister-concerns/chost-logo.png';
import productlyLogo from '@/assets/sister-concerns/productly-logo.png';
import zobayerLogo from '@/assets/sister-concerns/zobayershop-logo.png';

const sisterConcerns = [
  {
    name: 'CHost BD',
    nameBn: 'সিহোস্ট বিডি',
    tagline: 'Web Hosting & Domain Services',
    taglineBn: 'ওয়েব হোস্টিং ও ডোমেইন সেবা',
    logo: chostLogo,
    url: 'https://chostbd.com/',
  },
  {
    name: 'Productly',
    nameBn: 'প্রোডাক্টলি',
    tagline: 'Digital Product Marketplace',
    taglineBn: 'ডিজিটাল প্রোডাক্ট মার্কেটপ্লেস',
    logo: productlyLogo,
    url: 'https://productlybd.com/',
  },
  {
    name: 'Zobayer Shop',
    nameBn: 'জোবায়ের শপ',
    tagline: 'E-Commerce Solutions',
    taglineBn: 'ই-কমার্স সলিউশন',
    logo: zobayerLogo,
    url: 'https://zobayershop.xyz/',
  },
];

const SisterConcernSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-10 lg:py-14 bg-muted/20 border-b border-border/30">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              {language === 'en' ? 'Our Sister Concerns' : 'আমাদের সিস্টার কনসার্ন'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground lg:text-base">
              {language === 'en'
                ? 'Trusted ventures under the Creation Tech umbrella'
                : 'ক্রিয়েশন টেক এর অধীনে বিশ্বস্ত উদ্যোগসমূহ'}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {sisterConcerns.map((item, index) => (
            <ScrollReveal key={item.name} animation="fade-up" delay={index * 100}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:shadow-lg"
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  className="h-14 w-auto object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                  loading="lazy"
                />
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1 justify-center">
                    {language === 'bn' ? item.nameBn : item.name}
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {language === 'bn' ? item.taglineBn : item.tagline}
                  </p>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SisterConcernSection;
