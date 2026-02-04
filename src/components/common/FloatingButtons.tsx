import { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingButtons = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    // Replace with your WhatsApp number
    const phoneNumber = '8801XXXXXXXXX'; // Update this
    const message = encodeURIComponent('Hello! I would like to know more about your services.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:scale-110 active:scale-95',
          showBackToTop
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        )}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/8801XXXXXXXXX" // Update this
        onClick={(e) => {
          e.preventDefault();
          openWhatsApp();
        }}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:bg-[#20BA5C] hover:shadow-xl hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="h-6 w-6 transition-transform duration-200 group-hover:rotate-12" />
        
        {/* Pulse Animation */}
        <span className="absolute h-14 w-14 animate-ping rounded-full bg-[#25D366]/30" />
      </a>
    </div>
  );
};

export default FloatingButtons;
