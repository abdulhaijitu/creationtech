import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const CTASection = () => {
  const { t } = useLanguage();

  const actions = [
    {
      icon: FileText,
      titleEn: 'Get a Free Quote',
      titleBn: 'বিনামূল্যে কোটেশন নিন',
      descEn: 'Tell us about your project. We respond within 24 hours.',
      descBn: 'আপনার প্রকল্প সম্পর্কে বলুন। আমরা ২৪ ঘণ্টার মধ্যে উত্তর দিই।',
      href: '/contact?type=quote',
      variant: 'default' as const,
    },
    {
      icon: Calendar,
      titleEn: 'Book a Meeting',
      titleBn: 'মিটিং বুক করুন',
      descEn: 'Schedule a free 30-minute consultation call.',
      descBn: 'বিনামূল্যে ৩০ মিনিটের পরামর্শ কল সিডিউল করুন।',
      href: '/contact?type=meeting',
      variant: 'secondary' as const,
    },
    {
      icon: MessageSquare,
      titleEn: 'Send a Message',
      titleBn: 'বার্তা পাঠান',
      descEn: 'General inquiries? Drop us a quick message.',
      descBn: 'সাধারণ জিজ্ঞাসা? আমাদের একটি বার্তা পাঠান।',
      href: '/contact',
      variant: 'outline' as const,
    },
  ];

  const { language } = useLanguage();

  return (
    <section className="section-padding gradient-hero">
      <div className="container-custom">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
            {language === 'en'
              ? "Let's Build Something Great Together"
              : 'আসুন একসাথে দারুণ কিছু তৈরি করি'}
          </h2>
          <p className="mb-10 text-lg text-primary-foreground/80">
            {language === 'en'
              ? 'From discovery to delivery — we partner with you every step of the way.'
              : 'আবিষ্কার থেকে ডেলিভারি পর্যন্ত — প্রতিটি ধাপে আমরা আপনার সাথে আছি।'}
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className="group flex flex-col items-center rounded-xl bg-primary-foreground/10 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/20"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-primary-foreground">
                    {language === 'en' ? action.titleEn : action.titleBn}
                  </h3>
                  <p className="mb-4 text-sm text-primary-foreground/70">
                    {language === 'en' ? action.descEn : action.descBn}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-accent">
                    {language === 'en' ? 'Get Started' : 'শুরু করুন'}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
