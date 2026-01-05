import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBusinessInfoMap } from '@/hooks/useBusinessInfo';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t, language } = useLanguage();
  const { data: businessInfo, isLoading } = useBusinessInfoMap();

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

  const quickLinks = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.about', href: '/about' },
    { key: 'nav.services', href: '/services' },
    { key: 'nav.portfolio', href: '/portfolio' },
    { key: 'nav.blog', href: '/blog' },
    { key: 'nav.contact', href: '/contact' },
  ];

  const services = [
    { label: 'Web Development', href: '/services#web' },
    { label: 'Mobile Apps', href: '/services#mobile' },
    { label: 'Cloud Solutions', href: '/services#cloud' },
    { label: 'IT Consulting', href: '/services#consulting' },
    { label: 'Cybersecurity', href: '/services#security' },
  ];

  const socialLinks = [
    { icon: Facebook, key: 'social_facebook', label: 'Facebook' },
    { icon: Twitter, key: 'social_twitter', label: 'Twitter' },
    { icon: Linkedin, key: 'social_linkedin', label: 'LinkedIn' },
    { icon: Instagram, key: 'social_instagram', label: 'Instagram' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-5">
            <Link to="/" className="inline-block transition-opacity hover:opacity-80">
              <img src={logo} alt={getInfo('company_name', 'Creation Tech')} className="h-10" />
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/70 max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={getSocialLink(social.key, '#')}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/8 transition-all duration-200 hover:bg-primary-foreground/15"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/65 transition-colors duration-200 hover:text-primary-foreground"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              {t('footer.services')}
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    to={service.href}
                    className="text-sm text-primary-foreground/65 transition-colors duration-200 hover:text-primary-foreground"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
                {t('footer.contact')}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-primary-foreground/65">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-foreground/50" />
                  <span>{getInfo('address', '123 Tech Street, Dhaka 1205, Bangladesh', '১২৩ টেক স্ট্রিট, ঢাকা ১২০৫, বাংলাদেশ')}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-primary-foreground/65">
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary-foreground/50" />
                  <span>{getInfo('phone_primary', '+880 1XXX-XXXXXX')}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-primary-foreground/65">
                  <Mail className="h-4 w-4 flex-shrink-0 text-primary-foreground/50" />
                  <span>{getInfo('email_primary', 'info@creationtech.com')}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
                {t('footer.newsletter')}
              </h3>
              <p className="mb-4 text-sm text-primary-foreground/65">
                {t('footer.newsletterText')}
              </p>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  className="h-10 border-primary-foreground/15 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary-foreground/30"
                />
                <Button variant="secondary" size="sm" className="h-10 px-4">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-primary-foreground/55">{t('footer.copyright')}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-primary-foreground/55">
            <Link to="/terms" className="transition-colors duration-200 hover:text-primary-foreground">
              {language === 'en' ? 'Terms & Conditions' : 'শর্তাবলী'}
            </Link>
            <Link to="/privacy" className="transition-colors duration-200 hover:text-primary-foreground">
              {language === 'en' ? 'Privacy Policy' : 'গোপনীয়তা নীতি'}
            </Link>
            <Link to="/refund" className="transition-colors duration-200 hover:text-primary-foreground">
              {language === 'en' ? 'Refund Policy' : 'ফেরত নীতি'}
            </Link>
            <Link to="/cookies" className="transition-colors duration-200 hover:text-primary-foreground">
              {language === 'en' ? 'Cookie Policy' : 'কুকি নীতি'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
