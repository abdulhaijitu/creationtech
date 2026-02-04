import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBusinessInfoMap } from '@/hooks/useBusinessInfo';
import logo from '@/assets/logo.png';

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
    <footer className="bg-foreground text-background">
      {/* Top Section - Contact Bar */}
      <div className="border-b border-background/10">
        <div className="container-custom py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-6 text-sm text-background/70">
              <a
                href="mailto:info@creationtechbd.com"
                className="flex items-center gap-2 transition-colors hover:text-background"
              >
                <Mail className="h-4 w-4" />
                <span>info@creationtechbd.com</span>
              </a>
              <a
                href="tel:+8801833876434"
                className="flex items-center gap-2 transition-colors hover:text-background"
              >
                <Phone className="h-4 w-4" />
                <span>01833876434</span>
              </a>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={getSocialLink(social.key, '#')}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 transition-all duration-200 hover:bg-background/20 hover:scale-105"
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

      {/* Main Footer Content */}
      <div className="container-custom py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block transition-opacity hover:opacity-80">
              <img src={logo} alt={getInfo('company_name', 'Creation Tech')} className="h-10 brightness-0 invert" />
            </Link>
            <p className="text-sm leading-relaxed text-background/60 max-w-sm">
              {t('footer.description')}
            </p>
            
            {/* Address */}
            <div className="flex items-start gap-3 text-sm text-background/60">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-background/40" />
              <span>{getInfo('address', '123 Tech Street, Dhaka 1205, Bangladesh', '১২৩ টেক স্ট্রিট, ঢাকা ১২০৫, বাংলাদেশ')}</span>
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-background/90">
              {language === 'en' ? 'Company' : 'কোম্পানি'}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/60 transition-colors duration-200 hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-background/90">
              {language === 'en' ? 'Products' : 'প্রোডাক্ট'}
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/60 transition-colors duration-200 hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="mb-4 text-sm font-semibold text-background/90">
              {t('footer.newsletter') || (language === 'en' ? 'Stay Updated' : 'আপডেট থাকুন')}
            </h3>
            <p className="mb-4 text-sm text-background/60">
              {t('footer.newsletterText') || (language === 'en' ? 'Subscribe to our newsletter for the latest updates.' : 'সর্বশেষ আপডেটের জন্য আমাদের নিউজলেটার সাবস্ক্রাইব করুন।')}
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder={language === 'en' ? 'Enter your email' : 'ইমেইল দিন'}
                className="h-11 flex-1 border-background/20 bg-background/10 text-background placeholder:text-background/40 focus-visible:ring-background/30 focus-visible:border-background/30"
              />
              <Button 
                type="submit"
                size="icon"
                className="h-11 w-11 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container-custom py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-background/50">
              {t('footer.copyright') || `© ${new Date().getFullYear()} CreationTech. All rights reserved.`}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-background/50">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="transition-colors duration-200 hover:text-background"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
