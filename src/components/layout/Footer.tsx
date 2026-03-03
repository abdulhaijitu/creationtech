import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Github } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBusinessInfoMap } from '@/hooks/useBusinessInfo';
import logo from '@/assets/logo.png';
import { cn } from '@/lib/utils';

const Footer = () => {
  const { t, language } = useLanguage();
  const { data: businessInfo } = useBusinessInfoMap();

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

  const serviceLinks = [
    { label: language === 'en' ? 'Custom Software' : 'কাস্টম সফটওয়্যার', href: '/services' },
    { label: language === 'en' ? 'Mobile Apps' : 'মোবাইল অ্যাপ', href: '/services' },
    { label: language === 'en' ? 'AI Solutions' : 'এআই সলিউশন', href: '/services' },
    { label: language === 'en' ? 'UI/UX Design' : 'ইউআই/ইউএক্স ডিজাইন', href: '/services' },
    { label: language === 'en' ? 'Cloud & DevOps' : 'ক্লাউড ও ডেভঅপস', href: '/services' },
  ];

  const companyLinks = [
    { label: language === 'en' ? 'About Us' : 'আমাদের সম্পর্কে', href: '/about' },
    { label: language === 'en' ? 'Portfolio' : 'পোর্টফোলিও', href: '/portfolio' },
    { label: language === 'en' ? 'Blog' : 'ব্লগ', href: '/blog' },
    { label: language === 'en' ? 'Careers' : 'ক্যারিয়ার', href: '/careers' },
    { label: language === 'en' ? 'Contact' : 'যোগাযোগ', href: '/contact' },
  ];

  const socialLinks = [
    { icon: Facebook, key: 'social_facebook', label: 'Facebook' },
    { icon: Twitter, key: 'social_twitter', label: 'Twitter' },
    { icon: Linkedin, key: 'social_linkedin', label: 'LinkedIn' },
    { icon: Instagram, key: 'social_instagram', label: 'Instagram' },
  ];

  return (
    <footer className="relative bg-white pt-20 pb-8 overflow-hidden">
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-5">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <img src={logo} alt={getInfo('company_name', 'Creation Tech')} className="h-8" />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={getSocialLink(social.key, '#')}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    "bg-muted text-muted-foreground transition-all duration-300",
                    "hover:bg-foreground hover:text-background hover:scale-110"
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

          {/* Services */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-foreground uppercase tracking-wider">
              {language === 'en' ? 'Services' : 'সেবাসমূহ'}
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-muted-foreground/0 group-hover:bg-primary transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-foreground uppercase tracking-wider">
              {language === 'en' ? 'Company' : 'কোম্পানি'}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-muted-foreground/0 group-hover:bg-primary transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-foreground uppercase tracking-wider">
              {language === 'en' ? 'Contact' : 'যোগাযোগ'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-muted-foreground/60 flex-shrink-0" />
                <span>{getInfo('address', '123 Tech Street, Dhaka 1205, Bangladesh', '১২৩ টেক স্ট্রিট, ঢাকা ১২০৫, বাংলাদেশ')}</span>
              </div>
              <a
                href={`mailto:${getInfo('email', 'info@creationtechbd.com')}`}
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Mail className="h-5 w-5 text-muted-foreground/60 flex-shrink-0" />
                <span>{getInfo('email', 'info@creationtechbd.com')}</span>
              </a>
              <a
                href={`tel:${getInfo('phone', '+8801833876434')}`}
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Phone className="h-5 w-5 text-muted-foreground/60 flex-shrink-0" />
                <span>{getInfo('phone', '01833876434')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            {t('footer.copyright') || `© ${new Date().getFullYear()} ${getInfo('company_name', 'Creation Tech')}. ${language === 'en' ? 'All rights reserved.' : 'সর্বস্বত্ব সংরক্ষিত।'}`}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
