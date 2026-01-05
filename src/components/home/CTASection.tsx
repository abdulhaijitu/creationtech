import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, FileText, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CTASection = () => {
  const { t, language } = useLanguage();

  const actions = [
    {
      icon: FileText,
      titleEn: 'Get a Free Quote',
      titleBn: 'বিনামূল্যে কোটেশন নিন',
      descEn: 'Tell us about your project. We respond within 24 hours.',
      descBn: 'আপনার প্রকল্প সম্পর্কে বলুন। আমরা ২৪ ঘণ্টার মধ্যে উত্তর দিই।',
      href: '/contact?type=quote',
    },
    {
      icon: Calendar,
      titleEn: 'Book a Meeting',
      titleBn: 'মিটিং বুক করুন',
      descEn: 'Schedule a free 30-minute consultation call.',
      descBn: 'বিনামূল্যে ৩০ মিনিটের পরামর্শ কল সিডিউল করুন।',
      href: '/contact?type=meeting',
    },
    {
      icon: MessageSquare,
      titleEn: 'Send a Message',
      titleBn: 'বার্তা পাঠান',
      descEn: 'General inquiries? Drop us a quick message.',
      descBn: 'সাধারণ জিজ্ঞাসা? আমাদের একটি বার্তা পাঠান।',
      href: '/contact',
    },
  ];

  return (
    <section className="section-padding gradient-hero relative overflow-hidden">
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.5) 0%, transparent 50%),
                           radial-gradient(circle at 70% 60%, rgba(255,255,255,0.4) 0%, transparent 50%)`
        }}
      />
      
      <div className="container-custom relative">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-5 text-3xl font-bold text-primary-foreground sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
            {language === 'en'
              ? "Let's Build Something Great Together"
              : 'আসুন একসাথে দারুণ কিছু তৈরি করি'}
          </h2>
          <p className="mb-14 text-lg text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'From discovery to delivery — we partner with you every step of the way.'
              : 'আবিষ্কার থেকে ডেলিভারি পর্যন্ত — প্রতিটি ধাপে আমরা আপনার সাথে আছি।'}
          </p>

          <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className="group flex flex-col items-center rounded-2xl bg-primary-foreground/5 p-7 text-center backdrop-blur-sm transition-all duration-250 hover:bg-primary-foreground/10 border border-primary-foreground/10 hover:border-primary-foreground/20"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2.5 text-lg font-semibold text-primary-foreground">
                    {language === 'en' ? action.titleEn : action.titleBn}
                  </h3>
                  <p className="mb-5 text-sm text-primary-foreground/60 leading-relaxed">
                    {language === 'en' ? action.descEn : action.descBn}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-accent">
                    {language === 'en' ? 'Get Started' : 'শুরু করুন'}
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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
