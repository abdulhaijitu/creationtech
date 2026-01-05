import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const CTASection = () => {
  const { t } = useLanguage();

  const actions = [
    {
      icon: MessageSquare,
      titleEn: 'Contact Us',
      titleBn: 'যোগাযোগ করুন',
      descEn: 'Have questions? Get in touch with our team.',
      descBn: 'প্রশ্ন আছে? আমাদের দলের সাথে যোগাযোগ করুন।',
      href: '/contact',
      variant: 'default' as const,
    },
    {
      icon: FileText,
      titleEn: 'Get a Quote',
      titleBn: 'কোটেশন নিন',
      descEn: 'Request a detailed quote for your project.',
      descBn: 'আপনার প্রকল্পের জন্য বিস্তারিত কোটেশন অনুরোধ করুন।',
      href: '/contact?type=quote',
      variant: 'secondary' as const,
    },
    {
      icon: Calendar,
      titleEn: 'Book a Meeting',
      titleBn: 'মিটিং বুক করুন',
      descEn: 'Schedule a consultation with our experts.',
      descBn: 'আমাদের বিশেষজ্ঞদের সাথে পরামর্শ সিডিউল করুন।',
      href: '/contact?type=meeting',
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
              ? 'Ready to Transform Your Business?'
              : 'আপনার ব্যবসা রূপান্তর করতে প্রস্তুত?'}
          </h2>
          <p className="mb-10 text-lg text-primary-foreground/80">
            {language === 'en'
              ? "Let's discuss how we can help you achieve your digital goals."
              : 'আসুন আলোচনা করি কীভাবে আমরা আপনার ডিজিটাল লক্ষ্য অর্জনে সাহায্য করতে পারি।'}
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
                    {t('common.learnMore')}
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
