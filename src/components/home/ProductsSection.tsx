 import { useLanguage } from '@/contexts/LanguageContext';
 import ScrollReveal from '@/components/common/ScrollReveal';
 import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
 import { ArrowRight } from 'lucide-react';
 import { Link } from 'react-router-dom';
 import { cn } from '@/lib/utils';
import { useProducts, Product } from '@/hooks/useProducts';
 
// Fallback images for products without media
 import ispManagerImg from '@/assets/products/isp-manager.jpg';
 import somityAppImg from '@/assets/products/somity-app.jpg';
 import restaurantAppImg from '@/assets/products/restaurant-app.jpg';
 
const fallbackImages: Record<string, string> = {
  'isp-manager': ispManagerImg,
  'somity-app': somityAppImg,
  'restaurant-app': restaurantAppImg,
};

const getProductImage = (product: Product): string => {
  if (product.media && Array.isArray(product.media) && product.media.length > 0) {
    const imageMedia = product.media.find((m) => m.type === 'image' && m.url);
    if (imageMedia?.url) return imageMedia.url;
  }
  return fallbackImages[product.slug] || ispManagerImg;
};

const ProductCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl bg-card border border-border/50">
    <Skeleton className="aspect-[16/10] w-full" />
    <div className="p-5 sm:p-6 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);
 
 const ProductsSection = () => {
   const { language } = useLanguage();
  const { data: products, isLoading } = useProducts();
 
   const label = language === 'en' ? 'OUR PRODUCTS' : 'আমাদের পণ্য';
   const heading = language === 'en' 
     ? 'AI-Powered Products Built for Real-World Business Needs' 
     : 'বাস্তব ব্যবসায়িক চাহিদার জন্য তৈরি এআই-চালিত পণ্য';
   const ctaText = language === 'en' ? 'All Products' : 'সব পণ্য দেখুন';
 
  // Limit to first 3 products for homepage
  const displayProducts = products?.slice(0, 3) || [];

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
            {isLoading ? (
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : displayProducts.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">
                  {language === 'en' ? 'No products available.' : 'কোনো প্রোডাক্ট পাওয়া যায়নি।'}
                </p>
              </div>
            ) : (
              displayProducts.map((product, index) => (
             <ScrollReveal 
                key={product.slug} 
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
                      src={getProductImage(product)}
                      alt={language === 'en' ? product.name_en : (product.name_bn || product.name_en)}
                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                     loading="lazy"
                   />
                   {/* Image overlay on hover */}
                   <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 </div>
 
                 {/* Product Content */}
                 <div className="flex flex-col flex-1 p-5 sm:p-6">
                   <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                      {language === 'en' ? product.name_en : (product.name_bn || product.name_en)}
                   </h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                      {language === 'en' 
                        ? product.short_description_en 
                        : (product.short_description_bn || product.short_description_en)}
                   </p>
                 </div>
 
                 {/* Hover glow effect */}
                 <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                   <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/20" />
                 </div>
               </div>
             </ScrollReveal>
              ))
            )}
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