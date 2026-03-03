import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FinancialHeroProps {
  title: React.ReactNode;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl1: string;
  imageUrl2: string;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardsVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' as const, staggerChildren: 0.3 },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

export const FinancialHero = ({
  title,
  description,
  buttonText,
  buttonLink,
  imageUrl1,
  imageUrl2,
  className,
}: FinancialHeroProps) => {
  const gridBackgroundStyle = {
    backgroundImage:
      'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)',
    backgroundSize: '3rem 3rem',
  };

  return (
    <section className={cn('relative overflow-hidden bg-background py-16 lg:py-24', className)}>
      {/* Grid background */}
      <div className="absolute inset-0 opacity-30" style={gridBackgroundStyle} />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-transparent" />

      <div className="container-custom relative z-10 grid items-center gap-12 lg:grid-cols-2">
        {/* Left: Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            style={{ letterSpacing: '-0.02em' }}
          >
            {title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="max-w-lg text-base text-muted-foreground leading-relaxed sm:text-lg"
          >
            {description}
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button size="lg" asChild className="font-semibold">
              <a href={buttonLink}>
                {buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right: Card Images */}
        <motion.div
          variants={cardsVariants}
          initial="hidden"
          animate="visible"
          className="relative hidden h-[400px] lg:block"
        >
          {/* Back Card */}
          <motion.img
            variants={cardItemVariants}
            src={imageUrl1}
            alt="Project showcase 1"
            className="absolute right-12 top-8 h-72 w-80 rounded-2xl object-cover shadow-2xl ring-1 ring-border/50"
            loading="lazy"
          />
          {/* Front Card */}
          <motion.img
            variants={cardItemVariants}
            src={imageUrl2}
            alt="Project showcase 2"
            className="absolute left-4 bottom-4 h-72 w-80 rounded-2xl object-cover shadow-2xl ring-1 ring-border/50"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
};
