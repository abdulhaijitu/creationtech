import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBusinessInfoMap } from '@/hooks/useBusinessInfo';
import logo from '@/assets/logo.png';
import { cn } from '@/lib/utils';

const Footer = () => {
  const { t, language } = useLanguage();
  const { data: businessInfo } = useBusinessInfoMap();

  // Helper to get value with fallback
  const getInfo = (key: string, fallbackEn: string, fallbackBn?: string) => {
    const info = businessInfo[key];
    if (info) {
      return language === 'en' ? (info.value_en || fallbackEn) : (info.value_bn || fallbackBn || fallbackEn);
    }
    return language === 'en' ? fallbackEn : (fallbackBn || fallbackEn);
  };

  const getSocialLink = (key: string, fallback: string) => {
    const info = businessInfo[key];
    return info?.value_en || fallback;
  };

  const companyLinks = [
    { label: language === 'en' ? 'About Us' : 'আমাদের সম্পর্কে', href: '/about' },
    { label: language === 'en' ? 'Careers' : 'ক্যারিয়ার', href: '/careers' },
    { label: language === 'en' ? 'Blog' : 'ব্লগ', href: '/blog' },
    { label: language === 'en' ? 'Contact' : 'যোগাযোগ', href: '/contact' },
  ];

  const productLinks = [
    { label: language === 'en' ? 'Products' : 'প্রোডাক্ট', href: '/products' },
    { label: language === 'en' ? 'Services' : 'সার্ভিস', href: '/services' },
    { label: language === 'en' ? 'Portfolio' : 'পোর্টফোলিও', href: '/portfolio' },
    { label: language === 'en' ? 'Pricing' : 'মূল্য', href: '/pricing' },
  ];

  const legalLinks = [
    { label: language === 'en' ? 'Terms & Conditions' : 'শর্তাবলী', href: '/terms' },
    { label: language === 'en' ? 'Privacy Policy' : 'গোপনীয়তা নীতি', href: '/privacy' },
    { label: language === 'en' ? 'Refund Policy' : 'ফেরত নীতি', href: '/refund' },
    { label: language === 'en' ? 'Cookie Policy' : 'কুকি নীতি', href: '/cookies' },
  ];

  const socialLinks = [
    { icon: Facebook, key: 'social_facebook', label: 'Facebook' },
    { icon: Twitter, key: 'social_twitter', label: 'Twitter' },
    { icon: Linkedin, key: 'social_linkedin', label: 'LinkedIn' },
    { icon: Instagram, key: 'social_instagram', label: 'Instagram' },
  ];

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Note: Using slate-900 for footer dark background as it provides better contrast than foreground token */}
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Newsletter CTA Section */}
      <div className="relative border-b border-white/10">
        <div className="container-custom py-10 lg:py-12">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="max-w-lg">
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                {language === 'en' ? 'Stay Updated with Latest Tech Insights' : 'সর্বশেষ প্রযুক্তি তথ্য সম্পর্কে আপডেট থাকুন'}
              </h3>
              <p className="mt-2 text-sm text-white/60">
                {language === 'en' 
                  ? 'Get exclusive updates, industry news, and special offers directly to your inbox.'
                  : 'একচেটিয়া আপডেট, ইন্ডাস্ট্রি নিউজ এবং বিশেষ অফার সরাসরি আপনার ইনবক্সে পান।'}
              </p>
            </div>
            <form className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder={language === 'en' ? 'Enter your email address' : 'আপনার ইমেইল লিখুন'}
                className="h-12 flex-1 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-primary/50 focus-visible:border-primary/50"
              />
              <Button 
                type="submit"
                className="h-12 rounded-xl bg-primary px-6 hover:bg-primary/90 text-primary-foreground font-medium gap-2"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'en' ? 'Subscribe' : 'সাবস্ক্রাইব'}</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container-custom py-12 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block transition-opacity hover:opacity-80">
              <img src={logo} alt={getInfo('company_name', 'Creation Tech')} className="h-9 brightness-0 invert" />
            </Link>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              {t('footer.description')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href={`mailto:${getInfo('email', 'info@creationtechbd.com')}`}
                className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span>{getInfo('email', 'info@creationtechbd.com')}</span>
              </a>
              <a
                href={`tel:${getInfo('phone', '+8801833876434')}`}
                className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span>{getInfo('phone', '01833876434')}</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-white/60">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="pt-2">{getInfo('address', '123 Tech Street, Dhaka 1205, Bangladesh', '১২৩ টেক স্ট্রিট, ঢাকা ১২০৫, বাংলাদেশ')}</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              {language === 'en' ? 'Company' : 'কোম্পানি'}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center text-sm text-white/60 transition-colors duration-200 hover:text-white hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              {language === 'en' ? 'Services' : 'সেবা'}
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center text-sm text-white/60 transition-colors duration-200 hover:text-white hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              {language === 'en' ? 'Legal' : 'আইনি'}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center text-sm text-white/60 transition-colors duration-200 hover:text-white hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              {language === 'en' ? 'Connect' : 'সংযুক্ত হোন'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={getSocialLink(social.key, '#')}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    "bg-white/10 text-white/70 transition-all duration-200",
                    "hover:bg-primary hover:text-white hover:scale-110"
                  )}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container-custom py-5">
          <p className="text-center text-sm text-white/50">
            {t('footer.copyright') || `© ${new Date().getFullYear()} ${getInfo('company_name', 'Creation Tech')}. ${language === 'en' ? 'All rights reserved.' : 'সর্বস্বত্ব সংরক্ষিত।'}`}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
