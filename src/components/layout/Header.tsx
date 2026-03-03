import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, ArrowRight } from 'lucide-react';
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
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Topbar from './Topbar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTopbarVisible, setIsTopbarVisible] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { t, language } = useLanguage();
  const location = useLocation();

  // Fetch active portfolio projects for mega menu
  const { data: dynamicPortfolio } = useQuery({
    queryKey: ['nav-portfolio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('id, slug, title_en, title_bn, category')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(8);
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

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



  const companiesItems = [
    { href: '/about', label: 'About Us', description: 'Learn about our mission, vision, and values.' },
    { href: '/about#overview', label: 'Company Overview', description: 'Modern software products designed for business tasks.' },
    { href: '/about#leadership', label: 'Board of Directors', description: 'Meet the leadership team guiding our vision.' },
    { href: '/about#advisory', label: 'Advisory Board', description: 'Strategic leaders shaping our future.' },
    { href: '/about#concerns', label: 'Our Concerns', description: 'Product lines focused on reliability and outcomes.' },
    { href: '/about#life', label: 'Life at CreationTech', description: 'A collaborative workplace where talent grows.' },
    { href: '/about#partnerships', label: 'Partnerships Program', description: 'Share resources and grow business together.' },
    { href: '/about#reviews', label: 'Client Reviews', description: 'Hear from clients who trust our service quality.' },
    { href: '/careers', label: 'Careers', description: 'Explore career opportunities in a supportive environment.' },
    { href: '/contact', label: 'Contact Us', description: 'Reach out for support, demos, or partnerships.' },
  ];

  const resourcesItems = [
    { href: '/blog', label: 'News & Blogs', description: 'Stay updated with company news and industry insights.' },
    { href: '/contact#faq', label: "FAQ's", description: 'Find answers to common product questions.' },
    { href: '/contact#schedule', label: 'Schedule a Call', description: 'Book a session to discuss your project goals.' },
    { href: '/sitemap', label: 'Sitemap', description: 'View a structured list of all pages.' },
    { href: '/portfolio', label: 'Case Studies', description: 'Real examples of improved efficiency and growth.' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const isDropdownActive = (items: { href: string }[]) => {
    return items.some(item => isActive(item.href));
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

                {/* Portfolio Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      'bg-transparent px-4 py-2 text-sm font-medium',
                      isActive('/portfolio')
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                    )}
                  >
                    <Link to="/portfolio" onClick={(e) => e.stopPropagation()}>
                      Portfolio
                    </Link>
                  </NavigationMenuTrigger>
                  {(dynamicPortfolio || []).length > 0 && (
                    <NavigationMenuContent>
                      <div className="w-[480px] p-4">
                        <div className={cn(
                          "grid gap-2",
                          (dynamicPortfolio || []).length <= 4 ? "grid-cols-1" : "grid-cols-2"
                        )}>
                          {(dynamicPortfolio || []).map((p) => (
                            <NavigationMenuLink key={p.id} asChild>
                              <Link
                                to={`/portfolio/${p.slug}`}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {language === 'en' ? p.title_en : (p.title_bn || p.title_en)}
                                </div>
                                {p.category && (
                                  <p className="line-clamp-1 text-xs leading-snug text-muted-foreground mt-1">
                                    {p.category}
                                  </p>
                                )}
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                        <div className="mt-3 border-t border-border/50 pt-3">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/portfolio"
                              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline px-3"
                            >
                              {language === 'en' ? 'View All Projects' : 'সকল প্রজেক্ট দেখুন'}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  )}
                </NavigationMenuItem>

                {/* Companies Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      'bg-transparent px-4 py-2 text-sm font-medium',
                      isDropdownActive(companiesItems)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                    )}
                  >
                    <Link to="/about" onClick={(e) => e.stopPropagation()}>
                      Companies
                    </Link>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                      {companiesItems.map((item) => (
                        <NavigationMenuLink key={item.href} asChild>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.label}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      'bg-transparent px-4 py-2 text-sm font-medium',
                      isDropdownActive(resourcesItems)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                    )}
                  >
                    <Link to="/blog" onClick={(e) => e.stopPropagation()}>
                      Resources
                    </Link>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                      {resourcesItems.map((item) => (
                        <NavigationMenuLink key={item.href} asChild>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.label}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
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

                        {/* Portfolio Section */}
                        <div className="mt-4 mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Portfolio
                        </div>
                        <Link
                          to="/portfolio"
                          onClick={() => setIsSheetOpen(false)}
                          className="rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-secondary flex items-center gap-1"
                        >
                          {language === 'en' ? 'View All Projects' : 'সকল প্রজেক্ট দেখুন'}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        {(dynamicPortfolio || []).map((p) => (
                          <Link
                            key={p.id}
                            to={`/portfolio/${p.slug}`}
                            onClick={() => setIsSheetOpen(false)}
                            className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            {language === 'en' ? p.title_en : (p.title_bn || p.title_en)}
                          </Link>
                        ))}

                        {/* Companies Section */}
                        <div className="mt-4 mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Companies
                        </div>
                        {companiesItems.slice(0, 5).map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsSheetOpen(false)}
                            className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            {item.label}
                          </Link>
                        ))}

                        {/* Resources Section */}
                        <div className="mt-4 mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Resources
                        </div>
                        {resourcesItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsSheetOpen(false)}
                            className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            {item.label}
                          </Link>
                        ))}
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
