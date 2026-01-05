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

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt={getInfo('company_name', 'Creation Tech')} className="h-10" />
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              <a
                href={getSocialLink('social_facebook', '#')}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={getSocialLink('social_twitter', '#')}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={getSocialLink('social_linkedin', '#')}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={getSocialLink('social_instagram', '#')}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('footer.services')}</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    to={service.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">{t('footer.contact')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{getInfo('address', '123 Tech Street, Dhaka 1205, Bangladesh', '১২৩ টেক স্ট্রিট, ঢাকা ১২০৫, বাংলাদেশ')}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{getInfo('phone_primary', '+880 1XXX-XXXXXX')}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>{getInfo('email_primary', 'info@creationtech.com')}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">{t('footer.newsletter')}</h3>
              <p className="mb-3 text-sm text-primary-foreground/80">
                {t('footer.newsletterText')}
              </p>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
                />
                <Button variant="secondary" size="sm">
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
          <p className="text-sm text-primary-foreground/70">{t('footer.copyright')}</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-primary-foreground/70">
            <Link to="/terms" className="hover:text-primary-foreground">
              {language === 'en' ? 'Terms & Conditions' : 'শর্তাবলী'}
            </Link>
            <Link to="/privacy" className="hover:text-primary-foreground">
              {language === 'en' ? 'Privacy Policy' : 'গোপনীয়তা নীতি'}
            </Link>
            <Link to="/refund" className="hover:text-primary-foreground">
              {language === 'en' ? 'Refund Policy' : 'ফেরত নীতি'}
            </Link>
            <Link to="/cookies" className="hover:text-primary-foreground">
              {language === 'en' ? 'Cookie Policy' : 'কুকি নীতি'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
