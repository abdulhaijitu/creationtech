import { useLanguage } from '@/contexts/LanguageContext';

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
    <section className="py-12 bg-background">
      <div className="container-custom">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {language === 'en' ? 'Trusted Technology Partners' : 'বিশ্বস্ত প্রযুক্তি অংশীদার'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex h-12 w-24 items-center justify-center rounded-lg bg-muted text-lg font-bold text-muted-foreground transition-colors hover:bg-muted/80"
            >
              {partner.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
