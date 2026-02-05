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
     <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border lg:hidden safe-area-bottom">
       <div className="flex items-center justify-around h-16">
         {navItems.map((item) => {
           const active = isActive(item.href);
           return (
             <Link
               key={item.href}
               to={item.href}
               className={cn(
                 'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                 active
                   ? 'text-primary'
                   : 'text-muted-foreground hover:text-foreground'
               )}
             >
               <item.icon
                 className={cn(
                   'h-5 w-5 transition-transform',
                   active && 'scale-110'
                 )}
               />
               <span className="text-[10px] font-medium">{item.label}</span>
             </Link>
           );
         })}
       </div>
     </nav>
   );
 };
 
 export default MobileBottomBar;