import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, FileText, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  const { language } = useLanguage();

  const actions = [
    {
      icon: FileText,
      titleEn: 'Get a Free Quote',
      titleBn: 'বিনামূল্যে কোটেশন নিন',
      descEn: 'Tell us about your project. We respond within 24 hours.',
      descBn: 'আপনার প্রকল্প সম্পর্কে বলুন। আমরা ২৪ ঘণ্টার মধ্যে উত্তর দিই।',
      href: '/contact?type=quote',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Calendar,
      titleEn: 'Book a Meeting',
      titleBn: 'মিটিং বুক করুন',
      descEn: 'Schedule a free 30-minute consultation call.',
      descBn: 'বিনামূল্যে ৩০ মিনিটের পরামর্শ কল সিডিউল করুন।',
      href: '/contact?type=meeting',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: MessageSquare,
      titleEn: 'Send a Message',
      titleBn: 'বার্তা পাঠান',
      descEn: 'General inquiries? Drop us a quick message.',
      descBn: 'সাধারণ জিজ্ঞাসা? আমাদের একটি বার্তা পাঠান।',
      href: '/contact',
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <section className="relative overflow-hidden py-14 lg:py-20">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl" style={{ animationDelay: '2s' }} />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="container-custom relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <ScrollReveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              {language === 'en' ? "Let's Connect" : 'যোগাযোগ করুন'}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2 className="mb-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl" style={{ letterSpacing: '-0.02em' }}>
              {language === 'en'
                ? "Let's Build Something Great Together"
                : 'আসুন একসাথে দারুণ কিছু তৈরি করি'}
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={150}>
            <p className="mb-10 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              {language === 'en'
                ? 'From discovery to delivery — we partner with you every step of the way.'
                : 'আবিষ্কার থেকে ডেলিভারি পর্যন্ত — প্রতিটি ধাপে আমরা আপনার সাথে আছি।'}
            </p>
          </ScrollReveal>

          {/* Action Cards */}
          <div className="grid gap-5 sm:grid-cols-3 sm:gap-6 mb-10">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <ScrollReveal key={index} delay={200 + index * 80} animation="scale-in">
                  <Link
                    to={action.href}
                    className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl bg-white/[0.08] p-7 text-center backdrop-blur-md transition-all duration-300 hover:bg-white/[0.12] border border-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20"
                  >
                    {/* Hover Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
                    
                    {/* Icon */}
                    <div className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="relative mb-2.5 text-lg font-semibold text-white">
                      {language === 'en' ? action.titleEn : action.titleBn}
                    </h3>
                    <p className="relative mb-5 text-sm text-white/60 leading-relaxed">
                      {language === 'en' ? action.descEn : action.descBn}
                    </p>
                    
                    {/* CTA Link */}
                    <span className="relative inline-flex items-center text-sm font-medium text-white/90 mt-auto transition-colors duration-200 group-hover:text-white">
                      {language === 'en' ? 'Get Started' : 'শুরু করুন'}
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Primary CTA Button */}
          <ScrollReveal delay={500}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="group bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 px-8"
              >
                <Link to="/contact">
                  {language === 'en' ? 'Start Your Project' : 'প্রকল্প শুরু করুন'}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="group border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 px-8"
              >
                <Link to="/portfolio">
                  {language === 'en' ? 'View Our Work' : 'আমাদের কাজ দেখুন'}
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
