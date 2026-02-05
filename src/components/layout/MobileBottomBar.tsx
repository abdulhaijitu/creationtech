 import { Link, useLocation } from 'react-router-dom';
 import { Home, Package, Briefcase, Building2, Phone } from 'lucide-react';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { cn } from '@/lib/utils';
 
 const MobileBottomBar = () => {
   const { language } = useLanguage();
   const location = useLocation();
 
   const navItems = [
     {
       href: '/',
       icon: Home,
       label: language === 'en' ? 'Home' : 'হোম',
     },
     {
       href: '/products',
       icon: Package,
       label: language === 'en' ? 'Products' : 'প্রোডাক্ট',
     },
     {
       href: '/services',
       icon: Briefcase,
       label: language === 'en' ? 'Services' : 'সার্ভিস',
     },
     {
       href: '/about',
       icon: Building2,
       label: language === 'en' ? 'About' : 'সম্পর্কে',
     },
     {
       href: '/contact',
       icon: Phone,
       label: language === 'en' ? 'Contact' : 'যোগাযোগ',
     },
   ];
 
   const isActive = (href: string) => {
     if (href === '/') return location.pathname === '/';
     return location.pathname.startsWith(href);
   };
 
   return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-lg border-t border-border/60 lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-bottom">
      <div className="flex items-center justify-around h-[60px]">
         {navItems.map((item) => {
           const active = isActive(item.href);
           return (
             <Link
               key={item.href}
               to={item.href}
               className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-[64px] py-2',
                'transition-colors duration-200 active:scale-95',
                'touch-manipulation',
                 active
                   ? 'text-primary'
                  : 'text-muted-foreground active:text-foreground'
               )}
             >
              <div className={cn(
                'flex items-center justify-center w-10 h-7 rounded-full transition-colors duration-200',
                active && 'bg-primary/10'
              )}>
                <item.icon className="h-5 w-5" strokeWidth={active ? 2 : 1.5} />
              </div>
              <span className={cn(
                'text-[10px] leading-tight',
                active ? 'font-semibold' : 'font-medium'
              )}>{item.label}</span>
             </Link>
           );
         })}
       </div>
     </nav>
   );
 };
 
 export default MobileBottomBar;