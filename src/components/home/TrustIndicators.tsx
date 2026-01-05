import { useLanguage } from '@/contexts/LanguageContext';
import CountUp from '@/components/common/CountUp';

const stats = [
  { value: 10, suffix: '+', keyEn: 'Years Experience', keyBn: 'বছরের অভিজ্ঞতা' },
  { value: 500, suffix: '+', keyEn: 'Projects Delivered', keyBn: 'প্রকল্প সম্পন্ন' },
  { value: 200, suffix: '+', keyEn: 'Happy Clients', keyBn: 'সন্তুষ্ট ক্লায়েন্ট' },
  { value: 50, suffix: '+', keyEn: 'Team Members', keyBn: 'দলের সদস্য' },
];

const TrustIndicators = () => {
  const { language } = useLanguage();

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
