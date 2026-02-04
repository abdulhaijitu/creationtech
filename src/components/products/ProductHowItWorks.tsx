import { ClipboardList, Settings, Rocket, ChartLine } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';

const steps = [
  {
    icon: ClipboardList,
    stepNum: '01',
    titleEn: 'Assess Your Needs',
    titleBn: 'আপনার প্রয়োজন মূল্যায়ন করুন',
    descEn: 'We analyze your current workflows and identify automation opportunities.',
    descBn: 'আমরা আপনার বর্তমান ওয়ার্কফ্লো বিশ্লেষণ করি এবং অটোমেশন সুযোগ চিহ্নিত করি।',
  },
  {
    icon: Settings,
    stepNum: '02',
    titleEn: 'Configure & Customize',
    titleBn: 'কনফিগার ও কাস্টমাইজ করুন',
    descEn: 'Set up the platform with your preferences, integrations, and team structure.',
    descBn: 'আপনার পছন্দ, ইন্টিগ্রেশন এবং টিম স্ট্রাকচার সহ প্ল্যাটফর্ম সেটআপ করুন।',
  },
  {
    icon: Rocket,
    stepNum: '03',
    titleEn: 'Launch & Deploy',
    titleBn: 'লঞ্চ ও ডিপ্লয় করুন',
    descEn: 'Go live with minimal disruption. Our team ensures smooth onboarding.',
    descBn: 'ন্যূনতম বিঘ্ন সহ লাইভ হোন। আমাদের টিম মসৃণ অনবোর্ডিং নিশ্চিত করে।',
  },
  {
    icon: ChartLine,
    stepNum: '04',
    titleEn: 'Optimize & Scale',
    titleBn: 'অপ্টিমাইজ ও স্কেল করুন',
    descEn: 'Monitor performance, gain insights, and scale as your business grows.',
    descBn: 'পারফরম্যান্স মনিটর করুন, ইনসাইট অর্জন করুন এবং আপনার ব্যবসা বড় হলে স্কেল করুন।',
  },
];

const ProductHowItWorks = () => {
  const { language } = useLanguage();

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <ScrollReveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            {language === 'en' ? 'How It Works' : 'কিভাবে কাজ করে'}
          </span>
          <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
            {language === 'en'
              ? 'Simple Steps to Get Started'
              : 'শুরু করার সহজ ধাপ'}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {language === 'en'
              ? 'From setup to scale — we make the entire journey effortless.'
              : 'সেটআপ থেকে স্কেল পর্যন্ত — আমরা পুরো যাত্রাকে সহজ করে তুলি।'}
          </p>
        </ScrollReveal>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="absolute left-0 right-0 top-24 hidden h-0.5 bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={index} delay={index * 100} animation="fade-up">
                  <div className="group relative flex flex-col items-center text-center">
                    {/* Step Number */}
                    <div className="relative z-10 mb-6">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-all duration-300 group-hover:from-primary group-hover:to-primary/90 group-hover:text-primary-foreground group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:scale-110">
                        <Icon className="h-8 w-8" />
                      </div>
                      <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-lg">
                        {step.stepNum}
                      </span>
                    </div>
                    
                    <h3 className="mb-3 text-lg font-semibold text-foreground">
                      {language === 'en' ? step.titleEn : step.titleBn}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {language === 'en' ? step.descEn : step.descBn}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHowItWorks;
