 import { useState, useRef, useEffect } from 'react';
 import { cn } from '@/lib/utils';
 import { Skeleton } from '@/components/ui/skeleton';
 
 interface OptimizedImageProps {
   src: string;
   alt: string;
   className?: string;
   aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
   priority?: boolean;
 }
 
 /**
  * Optimized image component with:
  * - Native lazy loading
  * - Skeleton placeholder
  * - Fade-in animation on load
  * - Aspect ratio support
  */
 const OptimizedImage = ({
   src,
   alt,
   className,
   aspectRatio = 'auto',
   priority = false,
 }: OptimizedImageProps) => {
   const [isLoaded, setIsLoaded] = useState(false);
   const [isInView, setIsInView] = useState(priority);
   const imgRef = useRef<HTMLImageElement>(null);
 
   useEffect(() => {
     if (priority) return;
     
     const observer = new IntersectionObserver(
       ([entry]) => {
         if (entry.isIntersecting) {
           setIsInView(true);
           observer.disconnect();
         }
       },
       { rootMargin: '50px' }
     );
 
     if (imgRef.current) {
       observer.observe(imgRef.current);
     }
 
     return () => observer.disconnect();
   }, [priority]);
 
   const aspectClasses = {
     square: 'aspect-square',
     video: 'aspect-video',
     portrait: 'aspect-[3/4]',
     auto: '',
   };
 
   return (
     <div 
       ref={imgRef}
       className={cn(
         'relative overflow-hidden bg-muted',
         aspectClasses[aspectRatio],
         className
       )}
     >
       {!isLoaded && (
         <Skeleton className="absolute inset-0 w-full h-full" />
       )}
       {isInView && (
         <img
           src={src}
           alt={alt}
           loading={priority ? 'eager' : 'lazy'}
           decoding="async"
           onLoad={() => setIsLoaded(true)}
           className={cn(
             'w-full h-full object-cover transition-opacity duration-300',
             isLoaded ? 'opacity-100' : 'opacity-0'
           )}
         />
       )}
     </div>
   );
 };
 
 export default OptimizedImage;