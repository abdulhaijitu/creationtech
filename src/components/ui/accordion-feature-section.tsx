import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FeatureItem {
  id: string | number;
  title: string;
  image: string;
  description: string;
  link?: string;
}

interface Feature197Props {
  features: FeatureItem[];
  learnMoreLink?: string;
  learnMoreText?: string;
}

const Feature197 = ({ features, learnMoreLink = "/services", learnMoreText = "Learn More" }: Feature197Props) => {
  const [activeTabId, setActiveTabId] = useState<string | number>(features[0]?.id);
  const [activeImage, setActiveImage] = useState(features[0]?.image);

  if (!features.length) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Accordion
              type="single"
              value={String(activeTabId)}
              onValueChange={(value) => {
                const feature = features.find((f) => String(f.id) === value);
                if (feature) {
                  setActiveImage(feature.image);
                  setActiveTabId(feature.id);
                }
              }}
              collapsible={false}
            >
              {features.map((tab) => (
                <AccordionItem key={tab.id} value={String(tab.id)} className="border-b">
                  <AccordionTrigger
                    className="cursor-pointer py-5 !no-underline transition"
                  >
                    <span className="text-base font-semibold sm:text-lg">
                      {tab.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: tab.description }} 
                    />
                    <Link 
                      to={tab.link || learnMoreLink} 
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline transition-colors"
                    >
                      {learnMoreText}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <div className="mt-4 lg:hidden">
                      <img
                        src={tab.image}
                        alt={tab.title}
                        className="h-full max-h-80 w-full rounded-xl object-cover"
                        loading="lazy"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={activeImage}
              alt="Feature illustration"
              className="h-full max-h-[500px] w-full rounded-2xl object-cover"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              loading="lazy"
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export { Feature197 };
