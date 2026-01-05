import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.about', href: '/about' },
    { key: 'nav.services', href: '/services' },
    { key: 'nav.portfolio', href: '/portfolio' },
    { key: 'nav.blog', href: '/blog' },
    { key: 'nav.pricing', href: '/pricing' },
    { key: 'nav.careers', href: '/careers' },
    { key: 'nav.contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="CreationTech" className="h-10 lg:h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors duration-200',
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <LanguageToggle />
            <Button asChild>
              <Link to="/contact">{t('common.getQuote')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-border pb-4 lg:hidden">
            <nav className="flex flex-col space-y-1 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium transition-colors duration-200',
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="px-3 pt-4">
                <Button asChild className="w-full">
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    {t('common.getQuote')}
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
