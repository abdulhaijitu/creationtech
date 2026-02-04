import { Building2, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import CountUp from '@/components/common/CountUp';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

// Partner logo imports
import raceLogo from '@/assets/partners/race-logo.png';
import rioLogo from '@/assets/partners/rio-logo.png';
import skyviewLogo from '@/assets/partners/skyview-logo.png';
import speedtechLogo from '@/assets/partners/speedtech-logo.png';
import dataflowLogo from '@/assets/partners/dataflow-logo.png';
import techvisionLogo from '@/assets/partners/techvision-logo.png';

const partners = [
  { name: 'Race Online', logo: raceLogo },
  { name: 'Rio International', logo: rioLogo },
  { name: 'SkyView', logo: skyviewLogo },
  { name: 'SpeedTech', logo: speedtechLogo },
  { name: 'DataFlow', logo: dataflowLogo },
  { name: 'TechVision', logo: techvisionLogo },
];

const PartnersSection = () => {
  const { language } = useLanguage();
  const plugin = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: true })
  );

  return (
    <section className="py-12 lg:py-16 bg-muted/30 border-y border-border/30">
      <div className="container-custom">
        <div className="grid items-center gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Left Side - Trust Summary */}
          <ScrollReveal className="lg:col-span-2">
            <div className="flex items-center gap-5 text-center lg:text-left">
              {/* Icon */}
              <div className="hidden sm:flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <div className="relative">
                  <Building2 className="h-7 w-7 text-primary" />
                  <Globe className="absolute -bottom-1 -right-1 h-4 w-4 text-primary/70" />
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex-1">
                <div className="flex items-baseline gap-1 justify-center sm:justify-start lg:justify-start">
                  <span className="text-4xl font-bold tracking-tight text-primary lg:text-5xl">
                    <CountUp end={3500} duration={2500} />
                  </span>
                  <span className="text-3xl font-bold text-primary lg:text-4xl">+</span>
                </div>
                <p className="mt-1 text-sm font-medium text-muted-foreground lg:text-base">
                  {language === 'en' 
                    ? 'Companies Served in Bangladesh and Abroad' 
                    : 'বাংলাদেশ এবং বিদেশে সেবা প্রদান করা কোম্পানি'}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Side - Partner Logos Carousel */}
          <div className="lg:col-span-3">
            <ScrollReveal animation="fade-in">
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                plugins={[plugin.current]}
                className="w-full"
              >
                <CarouselContent className="-ml-3">
                  {partners.map((partner, index) => (
                    <CarouselItem key={index} className="pl-3 basis-1/3 sm:basis-1/4 lg:basis-1/3 xl:basis-1/4">
                      <div
                        className="group flex h-16 items-center justify-center rounded-xl border border-border/60 bg-background px-4 shadow-sm transition-all duration-200 hover:scale-105 hover:border-primary/30 hover:shadow-md lg:h-[72px]"
                        title={partner.name}
                      >
                        <img 
                          src={partner.logo} 
                          alt={partner.name}
                          className="h-10 w-auto max-w-[90px] object-contain grayscale transition-all duration-300 group-hover:grayscale-0 lg:h-12 lg:max-w-[100px]"
                          loading="lazy"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-4 h-8 w-8 border-border/60 bg-background/80 backdrop-blur-sm hover:bg-background" />
                <CarouselNext className="hidden sm:flex -right-4 h-8 w-8 border-border/60 bg-background/80 backdrop-blur-sm hover:bg-background" />
              </Carousel>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
