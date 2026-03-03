import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

import chostLogo from '@/assets/sister-concerns/chost-logo.png';
import productlyLogo from '@/assets/sister-concerns/productly-logo.png';
import zobayerLogo from '@/assets/sister-concerns/zobayershop-logo.png';

const fallbackData = [
  {
    id: 'fallback-1',
    name_en: 'CHost BD',
    name_bn: 'সিহোস্ট বিডি',
    tagline_en: 'Web Hosting & Domain Services',
    tagline_bn: 'ওয়েব হোস্টিং ও ডোমেইন সেবা',
    logo_url: chostLogo,
    website_url: 'https://chostbd.com/',
  },
  {
    id: 'fallback-2',
    name_en: 'Productly',
    name_bn: 'প্রোডাক্টলি',
    tagline_en: 'Digital Product Marketplace',
    tagline_bn: 'ডিজিটাল প্রোডাক্ট মার্কেটপ্লেস',
    logo_url: productlyLogo,
    website_url: 'https://productlybd.com/',
  },
  {
    id: 'fallback-3',
    name_en: 'Zobayer Shop',
    name_bn: 'জোবায়ের শপ',
    tagline_en: 'E-Commerce Solutions',
    tagline_bn: 'ই-কমার্স সলিউশন',
    logo_url: zobayerLogo,
    website_url: 'https://zobayershop.xyz/',
  },
];

const SisterConcernSection = () => {
  const { language } = useLanguage();

  const { data: concerns } = useQuery({
    queryKey: ['sister-concerns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sister_concerns')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const items = concerns && concerns.length > 0 ? concerns : fallbackData;

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
          {items.map((item, index) => (
            <ScrollReveal key={item.id} animation="fade-up" delay={index * 100}>
              <a
                href={item.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:shadow-lg"
              >
                <img
                  src={item.logo_url || ''}
                  alt={item.name_en}
                  className="h-14 w-auto object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                  loading="lazy"
                />
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1 justify-center">
                    {language === 'bn' ? item.name_bn : item.name_en}
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {language === 'bn' ? item.tagline_bn : item.tagline_en}
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
