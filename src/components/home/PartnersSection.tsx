import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';

const partners = [
  { name: 'Microsoft', logo: 'MS' },
  { name: 'Google Cloud', logo: 'GC' },
  { name: 'Amazon AWS', logo: 'AWS' },
  { name: 'Oracle', logo: 'ORC' },
  { name: 'Salesforce', logo: 'SF' },
  { name: 'Adobe', logo: 'ADB' },
];

const PartnersSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-14 lg:py-16 bg-background border-b border-border/30">
      <div className="container-custom">
        <ScrollReveal animation="fade-in">
          <p className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
            {language === 'en' ? 'Trusted Technology Partners' : 'বিশ্বস্ত প্রযুক্তি অংশীদার'}
          </p>
        </ScrollReveal>
        
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-14">
          {partners.map((partner, index) => (
            <ScrollReveal key={index} delay={index * 60} animation="fade-in" duration={400}>
              <div
                className="flex h-12 w-20 items-center justify-center rounded-lg text-base font-semibold text-muted-foreground/50 transition-all duration-200 hover:text-muted-foreground/70"
                title={partner.name}
              >
                {partner.logo}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
