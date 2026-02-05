import { useLanguage } from '@/contexts/LanguageContext';
import { usePageContent } from '@/hooks/usePageContent';
import CountUp from '@/components/common/CountUp';
import ScrollReveal from '@/components/common/ScrollReveal';

const defaultStats = [
  { value: 10, suffix: '+', keyEn: 'Years Experience', keyBn: 'বছরের অভিজ্ঞতা' },
  { value: 500, suffix: '+', keyEn: 'Projects Delivered', keyBn: 'প্রকল্প সম্পন্ন' },
  { value: 200, suffix: '+', keyEn: 'Happy Clients', keyBn: 'সন্তুষ্ট ক্লায়েন্ট' },
  { value: 50, suffix: '+', keyEn: 'Team Members', keyBn: 'দলের সদস্য' },
];

const TrustIndicators = () => {
  const { language } = useLanguage();
  const { data: homeContent } = usePageContent('home');

  const getStatFromCMS = (index: number) => {
    const sectionKey = `trust_stat_${index + 1}`;
    const cmsData = homeContent?.find((c) => c.section_key === sectionKey);
    const fallback = defaultStats[index];

    if (!cmsData) return fallback;

    const titleValue = language === 'en' ? cmsData.title_en : cmsData.title_bn;
    const numericValue = parseInt(titleValue?.replace(/[^0-9]/g, '') || '') || fallback.value;
    const suffix = titleValue?.includes('+') ? '+' : '';

    return {
      value: numericValue,
      suffix,
      keyEn: cmsData.content_en || fallback.keyEn,
      keyBn: cmsData.content_bn || fallback.keyBn,
    };
  };

  const stats = [0, 1, 2, 3].map(getStatFromCMS);

  const processSteps = [
    { en: 'Discover', bn: 'আবিষ্কার' },
    { en: 'Design', bn: 'ডিজাইন' },
    { en: 'Build', bn: 'নির্মাণ' },
    { en: 'Deliver', bn: 'ডেলিভার' },
  ];

  return (
    <section className="py-10 lg:py-14 bg-section-light">
      <div className="container-custom">
        {/* Trust Statement */}
        <ScrollReveal className="mb-8 text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {language === 'en' 
              ? 'Trusted by startups and enterprises across Bangladesh and beyond'
              : 'বাংলাদেশ এবং বিশ্বব্যাপী স্টার্টআপ ও এন্টারপ্রাইজের বিশ্বস্ত অংশীদার'}
          </p>
        </ScrollReveal>
        
        {/* Stats Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 100} animation="scale-in">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 text-4xl font-bold text-primary sm:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {language === 'en' ? stat.keyEn : stat.keyBn}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        
        {/* Process Steps */}
        <ScrollReveal delay={400} className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {processSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-2.5 rounded-full bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {language === 'en' ? step.en : step.bn}
              </span>
              {index < processSteps.length - 1 && (
                <span className="text-border text-lg hidden sm:inline">→</span>
              )}
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TrustIndicators;
