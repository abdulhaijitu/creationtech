 import { useLanguage } from '@/contexts/LanguageContext';
 import ScrollReveal from '@/components/common/ScrollReveal';
 import { Button } from '@/components/ui/button';
 import { ArrowRight } from 'lucide-react';
 import { Link } from 'react-router-dom';
 import { cn } from '@/lib/utils';
 
 import ispManagerImg from '@/assets/products/isp-manager.jpg';
 import somityAppImg from '@/assets/products/somity-app.jpg';
 import restaurantAppImg from '@/assets/products/restaurant-app.jpg';
 
 const products = [
   {
     id: 'isp-manager',
     nameEn: 'ISP Manager',
     nameBn: 'আইএসপি ম্যানেজার',
     descriptionEn: 'AI-assisted ISP & network management platform',
     descriptionBn: 'এআই-সহায়তা আইএসপি ও নেটওয়ার্ক ম্যানেজমেন্ট প্ল্যাটফর্ম',
     image: ispManagerImg,
   },
   {
     id: 'somity-app',
     nameEn: 'Somity App',
     nameBn: 'সমিতি অ্যাপ',
     descriptionEn: 'Smart digital solution for somity & cooperative management',
     descriptionBn: 'সমিতি ও সমবায় ব্যবস্থাপনার জন্য স্মার্ট ডিজিটাল সমাধান',
     image: somityAppImg,
   },
   {
     id: 'restaurant-app',
     nameEn: 'Restaurant App',
     nameBn: 'রেস্টুরেন্ট অ্যাপ',
     descriptionEn: 'AI-powered restaurant ordering & management system',
     descriptionBn: 'এআই-চালিত রেস্টুরেন্ট অর্ডারিং ও ম্যানেজমেন্ট সিস্টেম',
     image: restaurantAppImg,
   },
 ];
 
 const ProductsSection = () => {
   const { language } = useLanguage();
 
   const label = language === 'en' ? 'OUR PRODUCTS' : 'আমাদের পণ্য';
   const heading = language === 'en' 
     ? 'AI-Powered Products Built for Real-World Business Needs' 
     : 'বাস্তব ব্যবসায়িক চাহিদার জন্য তৈরি এআই-চালিত পণ্য';
   const ctaText = language === 'en' ? 'All Products' : 'সব পণ্য দেখুন';
 
   return (
    <section className="py-12 lg:py-16 bg-muted/30">
       <div className="container-custom">
         {/* Section Header */}
         <ScrollReveal animation="fade-up">
          <div className="text-center mb-10 lg:mb-12">
             <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-primary/80">
               {label}
             </span>
             <h2 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl max-w-3xl mx-auto">
               {heading}
             </h2>
           </div>
         </ScrollReveal>
 
         {/* Products Grid */}
         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
           {products.map((product, index) => (
             <ScrollReveal 
               key={product.id} 
               animation="fade-up"
               delay={index * 100}
             >
               <div
                 className={cn(
                   'group relative flex flex-col overflow-hidden rounded-2xl',
                   'bg-card border border-border/50',
                   'shadow-sm hover:shadow-xl',
                   'transition-all duration-300 ease-out',
                   'hover:-translate-y-2',
                   'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                 )}
               >
                 {/* Product Image */}
                 <div className="relative aspect-[16/10] overflow-hidden">
                   <img
                     src={product.image}
                     alt={language === 'en' ? product.nameEn : product.nameBn}
                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                     loading="lazy"
                   />
                   {/* Image overlay on hover */}
                   <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 </div>
 
                 {/* Product Content */}
                 <div className="flex flex-col flex-1 p-5 sm:p-6">
                   <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                     {language === 'en' ? product.nameEn : product.nameBn}
                   </h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     {language === 'en' ? product.descriptionEn : product.descriptionBn}
                   </p>
                 </div>
 
                 {/* Hover glow effect */}
                 <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                   <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/20" />
                 </div>
               </div>
             </ScrollReveal>
           ))}
         </div>
 
         {/* CTA Button */}
         <ScrollReveal animation="fade-up" delay={300}>
          <div className="flex justify-center mt-8 lg:mt-10">
             <Button
               asChild
               size="lg"
               className={cn(
                 'group px-8 py-6 text-base font-semibold',
                 'bg-primary hover:bg-primary/90',
                 'transition-all duration-200 ease-out',
                 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25',
                 'active:scale-[0.96]'
               )}
             >
               <Link to="/products">
                 {ctaText}
                 <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
               </Link>
             </Button>
           </div>
         </ScrollReveal>
       </div>
     </section>
   );
 };
 
 export default ProductsSection;