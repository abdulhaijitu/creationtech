import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Home, Package, Briefcase, LayoutGrid, Building2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import Topbar from './Topbar';

const navItems = [
  { href: '/', label: 'Home', labelBn: 'হোম', icon: Home },
  { href: '/products', label: 'Products', labelBn: 'প্রোডাক্ট', icon: Package },
  { href: '/services', label: 'Services', labelBn: 'সেবাসমূহ', icon: Briefcase },
  { href: '/portfolio', label: 'Portfolio', labelBn: 'পোর্টফোলিও', icon: LayoutGrid },
  { href: '/about', label: 'About', labelBn: 'সম্পর্কে', icon: Building2 },
  { href: '/blog', label: 'Blog', labelBn: 'ব্লগ', icon: BookOpen },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTopbarVisible, setIsTopbarVisible] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { t, language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      setIsTopbarVisible(scrollY < 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <Topbar isVisible={isTopbarVisible} />

      <nav
        className={cn(
          'w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-all duration-250 ease-out',
          isScrolled ? 'shadow-sm' : ''
        )}
      >
        <div className="container-custom">
          <div
            className={cn(
              'flex items-center justify-between transition-all duration-250 ease-out',
              isScrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-[72px]'
            )}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
              <img
                src={logo}
                alt="CreationTech"
                className={cn(
                  'transition-all duration-250 ease-out',
                  isScrolled ? 'h-8 lg:h-9' : 'h-9 lg:h-10'
                )}
              />
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="gap-0.5">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        'group relative rounded-md px-3.5 py-2 text-sm font-medium transition-all duration-200 inline-flex items-center',
                        isActive(item.href)
                          ? 'text-primary bg-primary/5'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          'absolute inset-x-3.5 -bottom-[1px] h-0.5 rounded-full bg-primary transition-transform duration-200 ease-out origin-left',
                          isActive(item.href)
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover:scale-x-100'
                        )}
                      />
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Desktop Right - Language + CTA */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              <LanguageToggle variant="minimal" />
              <Button
                asChild
                size="default"
                className="shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200"
              >
                <Link to="/contact">{t('common.getQuote') || 'Request a Quote'}</Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="flex items-center gap-3 lg:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Toggle menu" className="h-10 w-10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80 p-0">
                  <SheetHeader className="p-6 pb-4 border-b border-border/50">
                    <SheetTitle className="flex items-center justify-between">
                      <img src={logo} alt="CreationTech" className="h-8" />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col h-[calc(100vh-80px)]">
                    <nav className="flex-1 overflow-y-auto py-4">
                      <div className="flex flex-col gap-1 px-4">
                        {navItems.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.href);
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setIsSheetOpen(false)}
                              className={cn(
                                'flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200',
                                active
                                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                              )}
                            >
                              <Icon className={cn('h-4.5 w-4.5', active ? 'text-primary' : 'text-muted-foreground/70')} />
                              {language === 'en' ? item.label : item.labelBn}
                            </Link>
                          );
                        })}
                      </div>
                    </nav>

                    {/* Bottom Section */}
                    <div className="border-t border-border/50 p-4 space-y-4">
                      <div className="flex items-center justify-between px-4 py-2">
                        <span className="text-sm text-muted-foreground">
                          {t('common.language') || 'Language'}
                        </span>
                        <LanguageToggle variant="minimal" />
                      </div>
                      <Button asChild className="w-full" size="lg" onClick={() => setIsSheetOpen(false)}>
                        <Link to="/contact">{t('common.getQuote') || 'Request a Quote'}</Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full" onClick={() => setIsSheetOpen(false)}>
                        <Link to="/admin/login">{t('common.login') || 'Login'}</Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
