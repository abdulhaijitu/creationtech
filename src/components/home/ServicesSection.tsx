import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import { cn } from '@/lib/utils';

// Service illustrations
import softwareDevIllustration from '@/assets/services/software-dev-illustration.png';
import mobileAppIllustration from '@/assets/services/mobile-app-illustration.png';
import productDesignIllustration from '@/assets/services/product-design-illustration.png';
import itConsultingIllustration from '@/assets/services/it-consulting-illustration.png';

const services = [
  {
    id: 'software',
    titleEn: 'Custom Software Development',
    titleBn: 'কাস্টম সফটওয়্যার ডেভেলপমেন্ট',
    descEn: 'We specialize in delivering scalable and fully customized software solutions that align precisely with your business goals.',
    descBn: 'আমরা স্কেলেবল এবং সম্পূর্ণ কাস্টমাইজড সফটওয়্যার সলিউশন তৈরিতে বিশেষজ্ঞ যা আপনার ব্যবসায়িক লক্ষ্যের সাথে সঠিকভাবে সামঞ্জস্যপূর্ণ।',
    illustration: softwareDevIllustration,
    href: '/services#software',
  },
  {
    id: 'mobile',
    titleEn: 'Mobile App Development',
    titleBn: 'মোবাইল অ্যাপ ডেভেলপমেন্ট',
    descEn: 'Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.',
    descBn: 'নেটিভ এবং ক্রস-প্ল্যাটফর্ম মোবাইল অ্যাপ্লিকেশন যা iOS এবং Android-এ অসাধারণ ব্যবহারকারী অভিজ্ঞতা প্রদান করে।',
    illustration: mobileAppIllustration,
    href: '/services#mobile',
  },
  {
    id: 'design',
    titleEn: 'Product Design',
    titleBn: 'প্রোডাক্ট ডিজাইন',
    descEn: 'User-centered design solutions that transform ideas into intuitive, beautiful digital products.',
    descBn: 'ব্যবহারকারী-কেন্দ্রিক ডিজাইন সলিউশন যা আইডিয়াকে সুন্দর ডিজিটাল প্রোডাক্টে রূপান্তরিত করে।',
    illustration: productDesignIllustration,
    href: '/services#design',
  },
  {
    id: 'consulting',
    titleEn: 'IT Consulting',
    titleBn: 'আইটি পরামর্শ',
    descEn: 'Strategic technology guidance to optimize your IT infrastructure and drive digital transformation.',
    descBn: 'আপনার আইটি অবকাঠামো অপ্টিমাইজ এবং ডিজিটাল ট্রান্সফরমেশন চালানোর জন্য কৌশলগত প্রযুক্তি নির্দেশনা।',
    illustration: itConsultingIllustration,
    href: '/services#consulting',
  },
];

const ServicesSection = () => {
  const { language } = useLanguage();
  const [activeService, setActiveService] = useState(services[0].id);

  const currentService = services.find((s) => s.id === activeService) || services[0];

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/[0.02] via-background to-primary/[0.04] relative overflow-hidden">
      <div className="container-custom relative">
        {/* Two Column Layout */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Services List */}
          <ScrollReveal animation="fade-right" className="order-2 lg:order-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {language === 'en' ? 'Our Services' : 'আমাদের সেবাসমূহ'}
              </h2>
            </div>

            {/* Service Items */}
            <div className="space-y-0">
              {services.map((service, index) => {
                const isActive = activeService === service.id;
                return (
                  <div
                    key={service.id}
                    className={cn(
                      'group cursor-pointer border-t border-border/50 transition-all duration-300',
                      index === services.length - 1 && 'border-b',
                      isActive && 'border-t-primary/30'
                    )}
                    onClick={() => setActiveService(service.id)}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveService(service.id)}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isActive}
                    aria-controls={`service-desc-${service.id}`}
                  >
                    {/* Service Header */}
                    <div
                      className={cn(
                        'flex items-center gap-4 py-5 transition-all duration-300',
                        isActive ? 'py-6' : 'hover:pl-2'
                      )}
                    >
                      {/* Decorative Star Icon */}
                      <Sparkles
                        className={cn(
                          'h-5 w-5 flex-shrink-0 transition-all duration-300',
                          isActive
                            ? 'text-primary scale-110'
                            : 'text-primary/40 group-hover:text-primary/70 group-hover:rotate-12'
                        )}
                      />

                      {/* Title */}
                      <h3
                        className={cn(
                          'text-lg font-semibold transition-colors duration-300 sm:text-xl',
                          isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      >
                        {language === 'en' ? service.titleEn : service.titleBn}
                      </h3>
                    </div>

                    {/* Expandable Description */}
                    <div
                      id={`service-desc-${service.id}`}
                      className={cn(
                        'overflow-hidden transition-all duration-300 ease-out',
                        isActive ? 'max-h-32 opacity-100 pb-5' : 'max-h-0 opacity-0'
                      )}
                    >
                      <p className="pl-9 text-muted-foreground leading-relaxed pr-4">
                        {language === 'en' ? service.descEn : service.descBn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Right Side - Illustration Area */}
          <ScrollReveal animation="fade-left" className="order-1 lg:order-2">
            <div className="relative">
              {/* Illustration Container */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-primary/[0.02] to-emerald-500/10 p-4 sm:p-6 lg:p-8">
                {/* Floating Animation Wrapper */}
                <div className="animate-float">
                  <img
                    src={currentService.illustration}
                    alt={language === 'en' ? currentService.titleEn : currentService.titleBn}
                    className="w-full h-auto rounded-2xl shadow-lg transition-all duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
              </div>

              {/* CTA Link */}
              <div className="mt-6 flex justify-center lg:justify-start">
                <Link
                  to={currentService.href}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                >
                  <span className="uppercase tracking-wider">
                    {language === 'en' ? 'Learn More' : 'আরও জানুন'}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;