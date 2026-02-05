import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import { cn } from '@/lib/utils';
import {
  Store,
  Coins,
  Factory,
  GraduationCap,
  Briefcase,
  Radio,
  Truck,
  Building2,
  Plane,
} from 'lucide-react';
import industriesVisual from '@/assets/industries-ai-visual.jpg';

const industries = [
  {
    id: 'retail',
    nameEn: 'Retail',
    nameBn: 'রিটেইল',
    icon: Store,
  },
  {
    id: 'finance',
    nameEn: 'Finance',
    nameBn: 'ফাইন্যান্স',
    icon: Coins,
  },
  {
    id: 'manufacturing',
    nameEn: 'Manufacturing',
    nameBn: 'ম্যানুফ্যাকচারিং',
    icon: Factory,
  },
  {
    id: 'education',
    nameEn: 'Education',
    nameBn: 'শিক্ষা',
    icon: GraduationCap,
  },
  {
    id: 'professional',
    nameEn: 'Pro. Services',
    nameBn: 'প্রফেশনাল সার্ভিস',
    icon: Briefcase,
  },
  {
    id: 'telecoms',
    nameEn: 'Telecoms',
    nameBn: 'টেলিকম',
    icon: Radio,
  },
  {
    id: 'logistics',
    nameEn: 'Logistics',
    nameBn: 'লজিস্টিকস',
    icon: Truck,
  },
  {
    id: 'realestate',
    nameEn: 'Real Estate',
    nameBn: 'রিয়েল এস্টেট',
    icon: Building2,
  },
  {
    id: 'travel',
    nameEn: 'Travel',
    nameBn: 'ট্রাভেল',
    icon: Plane,
  },
];

const IndustriesSection = () => {
  const { language } = useLanguage();

  const label = language === 'en' ? 'INDUSTRIES WE SERVE' : 'যে শিল্পে আমরা কাজ করি';
  const heading = language === 'en'
    ? 'Industry-Focused Solutions that Deliver Results'
    : 'শিল্প-কেন্দ্রিক সমাধান যা ফলাফল দেয়';
  const description = language === 'en'
    ? 'We leverage deep industry expertise and years of hands-on experience to understand your unique challenges, delivering custom software that\'s not just technically sound but strategically built to solve business problems and drive growth.'
    : 'আমরা গভীর শিল্প দক্ষতা এবং বছরের অভিজ্ঞতা ব্যবহার করে আপনার অনন্য চ্যালেঞ্জ বুঝি, এমন কাস্টম সফটওয়্যার তৈরি করি যা শুধু প্রযুক্তিগতভাবে সঠিক নয় বরং ব্যবসায়িক সমস্যা সমাধান এবং প্রবৃদ্ধি চালাতে কৌশলগতভাবে তৈরি।';

  return (
    <section className="py-12 lg:py-16">
      <div className="container-custom">
        <ScrollReveal animation="fade-up">
          {/* Main Card Container */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1628] via-[#0d1d35] to-[#071222] p-6 sm:p-8 lg:p-12">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-20 pointer-events-none">
              <div 
                className="absolute inset-0 rounded-full blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)'
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-15 pointer-events-none">
              <div 
                className="absolute inset-0 rounded-full blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(6, 78, 59, 0.4) 0%, transparent 70%)'
                }}
              />
            </div>

            {/* Two Column Layout */}
            <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              {/* Left Column - Content + Visual */}
              <div className="flex flex-col">
                {/* Label */}
                <span className="inline-block mb-4 text-xs font-semibold uppercase tracking-widest text-teal-400/80">
                  {label}
                </span>

                {/* Heading */}
                <h2 className="mb-5 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {heading}
                </h2>

                {/* Description */}
                <p className="mb-8 text-sm leading-relaxed text-white/60 sm:text-base lg:max-w-md">
                  {description}
                </p>

                {/* Visual Block */}
                <div className="relative mt-auto">
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* AI/Tech Visual Image */}
                    <img 
                      src={industriesVisual} 
                      alt="AI and Technology visualization representing industry solutions"
                      className="aspect-[16/10] w-full object-cover"
                      loading="lazy"
                    />
                    {/* Gradient overlay for blend */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 via-transparent to-[#0a1628]/20" />
                  </div>
                </div>
              </div>

              {/* Right Column - Industry Grid */}
              <div className="flex items-center">
                <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {industries.map((industry, index) => {
                    const Icon = industry.icon;
                    return (
                      <div
                        key={industry.id}
                        className={cn(
                          'group relative flex flex-col items-center justify-center rounded-xl',
                          'bg-white/[0.03] backdrop-blur-sm border border-white/[0.08]',
                          'p-4 sm:p-5 lg:p-6',
                          'transition-all duration-250 ease-out',
                          'hover:bg-white/[0.08] hover:border-teal-500/30 hover:-translate-y-1',
                          'hover:shadow-lg hover:shadow-teal-500/10',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50',
                          'cursor-pointer'
                        )}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={language === 'en' ? industry.nameEn : industry.nameBn}
                      >
                        {/* Icon container */}
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05] transition-colors duration-200 group-hover:bg-teal-500/10 sm:h-12 sm:w-12">
                          <Icon 
                            className="h-5 w-5 text-white/70 transition-colors duration-200 group-hover:text-teal-400 sm:h-6 sm:w-6" 
                            strokeWidth={1.5}
                          />
                        </div>

                        {/* Industry name */}
                        <span className="text-center text-xs font-medium uppercase tracking-wider text-white/70 transition-colors duration-200 group-hover:text-white sm:text-sm">
                          {language === 'en' ? industry.nameEn : industry.nameBn}
                        </span>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500/5 to-transparent" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default IndustriesSection;
