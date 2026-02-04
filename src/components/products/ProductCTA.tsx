import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';

const benefits = [
  { en: 'No credit card required', bn: 'ক্রেডিট কার্ড প্রয়োজন নেই' },
  { en: '14-day free trial', bn: '১৪ দিনের ফ্রি ট্রায়াল' },
  { en: 'Full feature access', bn: 'সব ফিচারে অ্যাক্সেস' },
  { en: 'Cancel anytime', bn: 'যেকোনো সময় বাতিল করুন' },
];

const ProductCTA = () => {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden gradient-hero py-20 lg:py-28">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.5) 0%, transparent 50%),
                           radial-gradient(circle at 70% 60%, rgba(255,255,255,0.4) 0%, transparent 50%)`
        }}
      />
      
      <div className="container-custom relative">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <h2 className="mb-5 text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl" style={{ letterSpacing: '-0.02em' }}>
              {language === 'en'
                ? 'Ready to Transform Your Business?'
                : 'আপনার ব্যবসা রূপান্তর করতে প্রস্তুত?'}
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={100}>
            <p className="mb-10 text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
              {language === 'en'
                ? 'Join thousands of businesses already using CreationOS to automate, analyze, and accelerate their growth.'
                : 'হাজার হাজার ব্যবসায় যোগ দিন যারা ইতিমধ্যে তাদের বৃদ্ধি অটোমেট, বিশ্লেষণ এবং ত্বরান্বিত করতে CreationOS ব্যবহার করছে।'}
            </p>
          </ScrollReveal>
          
          {/* Benefits */}
          <ScrollReveal delay={200}>
            <div className="mb-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>{language === 'en' ? benefit.en : benefit.bn}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
          
          {/* CTAs */}
          <ScrollReveal delay={300}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="xl" 
                variant="accent" 
                asChild 
                className="group shadow-lg hover:shadow-xl min-w-[200px]"
              >
                <Link to="/contact?type=quote">
                  {language === 'en' ? 'Start Free Trial' : 'ফ্রি ট্রায়াল শুরু করুন'}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                size="xl" 
                variant="outline" 
                asChild 
                className="group border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground min-w-[200px]"
              >
                <Link to="/contact?type=meeting">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {language === 'en' ? 'Talk to an Expert' : 'বিশেষজ্ঞের সাথে কথা বলুন'}
                </Link>
              </Button>
            </div>
          </ScrollReveal>
          
          {/* Trust Note */}
          <ScrollReveal delay={400}>
            <p className="mt-8 text-sm text-primary-foreground/50">
              {language === 'en'
                ? 'Trusted by 500+ companies worldwide • SOC2 Compliant • GDPR Ready'
                : 'বিশ্বব্যাপী ৫০০+ কোম্পানির বিশ্বস্ত • SOC2 কমপ্লায়েন্ট • GDPR রেডি'}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ProductCTA;
