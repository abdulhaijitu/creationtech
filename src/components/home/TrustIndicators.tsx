import { useLanguage } from '@/contexts/LanguageContext';
import { usePageContent } from '@/hooks/usePageContent';
import CountUp from '@/components/common/CountUp';

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

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-custom">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-2 text-4xl font-bold text-primary sm:text-5xl">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-muted-foreground">
                {language === 'en' ? stat.keyEn : stat.keyBn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
