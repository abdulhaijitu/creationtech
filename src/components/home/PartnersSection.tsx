import { Building2, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import CountUp from '@/components/common/CountUp';

// Placeholder partner logos - replace with actual client logos
const partners = [
  { name: 'Race Online', initials: 'RACE' },
  { name: 'Rio International', initials: 'RIO' },
  { name: 'SkyView Online', initials: 'SKY' },
  { name: 'SpeedTech', initials: 'ST' },
  { name: 'TechVision', initials: 'TV' },
  { name: 'DataFlow', initials: 'DF' },
];

const PartnersSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-12 lg:py-16 bg-muted/30 border-y border-border/30">
      <div className="container-custom">
        <div className="grid items-center gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Left Side - Trust Summary */}
          <ScrollReveal className="lg:col-span-2">
            <div className="flex items-center gap-5 text-center lg:text-left">
              {/* Icon */}
              <div className="hidden sm:flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <div className="relative">
                  <Building2 className="h-7 w-7 text-primary" />
                  <Globe className="absolute -bottom-1 -right-1 h-4 w-4 text-primary/70" />
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex-1">
                <div className="flex items-baseline gap-1 justify-center sm:justify-start lg:justify-start">
                  <span className="text-4xl font-bold tracking-tight text-primary lg:text-5xl">
                    <CountUp end={3500} duration={2500} />
                  </span>
                  <span className="text-3xl font-bold text-primary lg:text-4xl">+</span>
                </div>
                <p className="mt-1 text-sm font-medium text-muted-foreground lg:text-base">
                  {language === 'en' 
                    ? 'Companies Served in Bangladesh and Abroad' 
                    : 'বাংলাদেশ এবং বিদেশে সেবা প্রদান করা কোম্পানি'}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Side - Partner Logos */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden">
              {/* Fade edges for scroll effect */}
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-muted/30 to-transparent lg:w-12" />
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-muted/30 to-transparent lg:w-12" />
              
              {/* Logo carousel container */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide lg:overflow-visible lg:flex-wrap lg:justify-end lg:gap-3">
                {partners.map((partner, index) => (
                  <ScrollReveal 
                    key={index} 
                    delay={index * 80} 
                    animation="fade-in" 
                    duration={400}
                    className="flex-shrink-0"
                  >
                    <div
                      className="group flex h-14 min-w-[120px] items-center justify-center rounded-xl border border-border/60 bg-background px-6 shadow-sm transition-all duration-200 hover:scale-105 hover:border-primary/30 hover:shadow-md lg:h-16 lg:min-w-[140px]"
                      title={partner.name}
                    >
                      {/* Placeholder logo - grayscale by default, color on hover */}
                      <span className="text-base font-bold tracking-wide text-muted-foreground/60 transition-colors duration-200 group-hover:text-foreground lg:text-lg">
                        {partner.initials}
                      </span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
