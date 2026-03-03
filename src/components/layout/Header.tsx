import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
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
      setIsTopbarVisible(scrollY < 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const simpleNavItems = [
    { href: '/', label: 'Home' },
  ];



  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Topbar */}
      <Topbar isVisible={isTopbarVisible} />

      {/* Main Navbar */}
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
            {/* Left - Logo */}
            <Link
              to="/"
              className="flex items-center transition-opacity hover:opacity-80"
            >
              <img
                src={logo}
                alt="CreationTech"
                className={cn(
                  'transition-all duration-250 ease-out',
                  isScrolled ? 'h-8 lg:h-9' : 'h-9 lg:h-10'
                )}
              />
            </Link>

            {/* Center - Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="gap-1">
                {/* Simple nav items */}
                {simpleNavItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        'group relative px-4 py-2 text-sm font-medium transition-colors duration-200 inline-flex items-center',
                        isActive(item.href)
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          'absolute inset-x-4 -bottom-[1px] h-0.5 rounded-full bg-primary transition-transform duration-200 ease-out origin-left',
                          isActive(item.href)
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover:scale-x-100'
                        )}
                      />
                    </Link>
                  </NavigationMenuItem>
                ))}

                {/* Products Link */}
                <NavigationMenuItem>
                  <Link
                    to="/products"
                    className={cn(
                      'group relative px-4 py-2 text-sm font-medium transition-colors duration-200 inline-flex items-center',
                      isActive('/products')
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Products
                    <span
                      className={cn(
                        'absolute inset-x-4 -bottom-[1px] h-0.5 rounded-full bg-primary transition-transform duration-200 ease-out origin-left',
                        isActive('/products')
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      )}
                    />
                  </Link>
                </NavigationMenuItem>

                {/* Services Link */}
                <NavigationMenuItem>
                  <Link
                    to="/services"
                    className={cn(
                      'group relative px-4 py-2 text-sm font-medium transition-colors duration-200 inline-flex items-center',
                      isActive('/services')
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Services
                    <span
                      className={cn(
                        'absolute inset-x-4 -bottom-[1px] h-0.5 rounded-full bg-primary transition-transform duration-200 ease-out origin-left',
                        isActive('/services')
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      )}
                    />
                  </Link>
                </NavigationMenuItem>

                {/* Portfolio Link */}
                <NavigationMenuItem>
                  <Link
                    to="/portfolio"
                    className={cn(
                      'group relative px-4 py-2 text-sm font-medium transition-colors duration-200 inline-flex items-center',
                      isActive('/portfolio')
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Portfolio
                    <span
                      className={cn(
                        'absolute inset-x-4 -bottom-[1px] h-0.5 rounded-full bg-primary transition-transform duration-200 ease-out origin-left',
                        isActive('/portfolio')
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      )}
                    />
                  </Link>
                </NavigationMenuItem>

                {/* Companies Link */}
                <NavigationMenuItem>
                  <Link
                    to="/about"
                    className={cn(
                      'group relative px-4 py-2 text-sm font-medium transition-colors duration-200 inline-flex items-center',
                      isActive('/about')
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Companies
                    <span
                      className={cn(
                        'absolute inset-x-4 -bottom-[1px] h-0.5 rounded-full bg-primary transition-transform duration-200 ease-out origin-left',
                        isActive('/about')
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      )}
                    />
                  </Link>
                </NavigationMenuItem>

                {/* Resources Link */}
                <NavigationMenuItem>
                  <Link
                    to="/blog"
                    className={cn(
                      'group relative px-4 py-2 text-sm font-medium transition-colors duration-200 inline-flex items-center',
                      isActive('/blog')
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Resources
                    <span
                      className={cn(
                        'absolute inset-x-4 -bottom-[1px] h-0.5 rounded-full bg-primary transition-transform duration-200 ease-out origin-left',
                        isActive('/blog')
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      )}
                    />
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right - CTA Button */}
            <div className="hidden lg:flex lg:items-center lg:gap-4">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle menu"
                    className="h-10 w-10"
                  >
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
                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto py-4">
                      <div className="flex flex-col gap-1 px-4">
                        {simpleNavItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsSheetOpen(false)}
                            className={cn(
                              'rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200',
                              isActive(item.href)
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            )}
                          >
                            {item.label}
                          </Link>
                        ))}

                        {/* Products Link */}
                        <Link
                          to="/products"
                          onClick={() => setIsSheetOpen(false)}
                          className={cn(
                            'rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200',
                            isActive('/products')
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          )}
                        >
                          {language === 'en' ? 'Products' : 'প্রোডাক্ট'}
                        </Link>

                        {/* Services Link */}
                        <Link
                          to="/services"
                          onClick={() => setIsSheetOpen(false)}
                          className={cn(
                            'rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200',
                            isActive('/services')
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          )}
                        >
                          {language === 'en' ? 'Services' : 'সেবাসমূহ'}
                        </Link>

                        {/* Portfolio Link */}
                        <Link
                          to="/portfolio"
                          onClick={() => setIsSheetOpen(false)}
                          className={cn(
                            'rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200',
                            isActive('/portfolio')
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          )}
                        >
                          {language === 'en' ? 'Portfolio' : 'পোর্টফোলিও'}
                        </Link>

                        {/* Companies Link */}
                        <Link
                          to="/about"
                          onClick={() => setIsSheetOpen(false)}
                          className={cn(
                            'rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200',
                            isActive('/about')
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          )}
                        >
                          {language === 'en' ? 'Companies' : 'কোম্পানি'}
                        </Link>

                        {/* Resources Link */}
                        <Link
                          to="/blog"
                          onClick={() => setIsSheetOpen(false)}
                          className={cn(
                            'rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200',
                            isActive('/blog')
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          )}
                        >
                          {language === 'en' ? 'Resources' : 'রিসোর্স'}
                        </Link>
                      </div>
                    </nav>

                    {/* Bottom Section */}
                    <div className="border-t border-border/50 p-4 space-y-4">
                      {/* Language Switcher */}
                      <div className="flex items-center justify-between px-4 py-2">
                        <span className="text-sm text-muted-foreground">
                          {t('common.language') || 'Language'}
                        </span>
                        <LanguageToggle variant="minimal" />
                      </div>

                      {/* CTA Button */}
                      <Button
                        asChild
                        className="w-full"
                        size="lg"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Link to="/contact">
                          {t('common.getQuote') || 'Request a Quote'}
                        </Link>
                      </Button>

                      {/* Login Link */}
                      <Button
                        variant="outline"
                        asChild
                        className="w-full"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Link to="/admin/login">
                          {t('common.login') || 'Login'}
                        </Link>
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
