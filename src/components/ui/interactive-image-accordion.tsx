import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AccordionItemData {
  id: number;
  title: string;
  imageUrl: string;
}

interface ImageAccordionProps {
  items?: AccordionItemData[];
  defaultActiveIndex?: number;
  className?: string;
}

const defaultItems: AccordionItemData[] = [
  {
    id: 1,
    title: 'Custom Software',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'AI Solutions',
    imageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Mobile Apps',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Cloud & DevOps',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'UI/UX Design',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2064&auto=format&fit=crop',
  },
];

const AccordionPanel = ({
  item,
  isActive,
  onMouseEnter,
}: {
  item: AccordionItemData;
  isActive: boolean;
  onMouseEnter: () => void;
}) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className={cn(
        'relative h-[420px] cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 ease-in-out',
        isActive
          ? 'flex-[4] border-teal-500/30 shadow-xl shadow-teal-500/10'
          : 'flex-[1] border-white/10 hover:border-white/20'
      )}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src =
            'https://placehold.co/400x450/0a1628/14b8a6?text=' + encodeURIComponent(item.title);
        }}
      />

      {/* Dark overlay */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-500',
          isActive
            ? 'bg-gradient-to-t from-black/80 via-black/30 to-transparent'
            : 'bg-black/60'
        )}
      />

      {/* Caption */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 p-4 transition-all duration-500',
          isActive ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100'
        )}
      >
        <h3
          className={cn(
            'font-semibold text-white transition-all duration-500',
            isActive ? 'text-lg' : 'text-sm [writing-mode:vertical-lr] rotate-180 mx-auto'
          )}
        >
          {item.title}
        </h3>
      </div>
    </div>
  );
};

export function InteractiveImageAccordion({
  items = defaultItems,
  defaultActiveIndex = 1,
  className,
}: ImageAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  return (
    <div className={cn('flex gap-2', className)}>
      {items.map((item, index) => (
        <AccordionPanel
          key={item.id}
          item={item}
          isActive={activeIndex === index}
          onMouseEnter={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}
