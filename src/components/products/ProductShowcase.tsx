import { Link } from 'react-router-dom';
import { ArrowRight, Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import OptimizedImage from '@/components/common/OptimizedImage';
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
  // Check if product has media with an image
  if (product.media && Array.isArray(product.media) && product.media.length > 0) {
    const imageMedia = product.media.find((m) => m.type === 'image' && m.url);
    if (imageMedia?.url) return imageMedia.url;
  }
  // Use fallback image based on slug
  return fallbackImages[product.slug] || ispManagerImg;
};

const getHighlights = (product: Product): string[] => {
  if (product.highlights && Array.isArray(product.highlights)) {
    return product.highlights.slice(0, 3);
  }
  return [];
};

const ProductCardSkeleton = () => (
  <div className="h-full overflow-hidden rounded-2xl border border-border/50 bg-card">
    <Skeleton className="aspect-[16/10] w-full" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  </div>
);

const ProductShowcase = () => {
  const { language } = useLanguage();
  const { data: products, isLoading } = useProducts();

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <ScrollReveal>
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
              {language === 'en' ? 'Product Showcase' : 'প্রোডাক্ট শোকেস'}
            </span>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
              {language === 'en' ? 'Solutions Built for Growth' : 'বৃদ্ধির জন্য তৈরি সমাধান'}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-muted-foreground">
              {language === 'en'
                ? 'Enterprise-grade software designed to streamline operations and drive business success.'
                : 'এন্টারপ্রাইজ-গ্রেড সফটওয়্যার যা অপারেশন সুবিন্যস্ত করতে এবং ব্যবসায়িক সাফল্য চালাতে ডিজাইন করা হয়েছে।'}
            </p>
          </ScrollReveal>
        </div>

        {/* Products Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          ) : !products?.length ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {language === 'en' ? 'No products available.' : 'কোনো প্রোডাক্ট পাওয়া যায়নি।'}
              </p>
            </div>
          ) : (
            products.map((product, index) => (
            <ScrollReveal key={product.slug} delay={200 + index * 100} animation="fade-in">
              <div className="group h-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                {/* Product Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <OptimizedImage
                    src={getProductImage(product)}
                    alt={language === 'en' ? product.name_en : (product.name_bn || product.name_en)}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Card Content */}
                <div className="flex flex-col p-6">
                  {/* Title */}
                  <h3 className="mb-2 text-xl font-bold text-foreground">
                    {language === 'en' ? product.name_en : (product.name_bn || product.name_en)}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                    {language === 'en' 
                      ? product.short_description_en 
                      : (product.short_description_bn || product.short_description_en)}
                  </p>

                  {/* Highlights */}
                  {getHighlights(product).length > 0 && (
                    <ul className="mb-6 flex-1 space-y-2">
                      {getHighlights(product).map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{highlight}</span>
                      </li>
                      ))}
                    </ul>
                  )}

                  {/* CTAs */}
                  <div className="flex flex-col gap-3 lg:flex-row">
                    <Button asChild className="group/btn w-full lg:flex-1 transition-all duration-200 active:scale-[0.96]">
                      <Link to={`/products/${product.slug}`}>
                        {language === 'en' ? 'View Details' : 'বিস্তারিত দেখুন'}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full lg:flex-1 transition-all duration-200 active:scale-[0.96]">
                      <Link to="/contact?type=meeting">
                        <Play className="mr-2 h-4 w-4" />
                        {language === 'en' ? 'Request Demo' : 'ডেমো রিকোয়েস্ট'}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;