import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  variant?: 'default' | 'minimal';
}

const LanguageToggle = ({ variant = 'default' }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <span
          className={cn(
            'transition-all duration-200',
            language === 'en' ? 'text-foreground font-medium' : 'opacity-60'
          )}
        >
          EN
        </span>
        <span className="text-border">|</span>
        <span
          className={cn(
            'font-bangla transition-all duration-200',
            language === 'bn' ? 'text-foreground font-medium' : 'opacity-60'
          )}
        >
          বাং
        </span>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 font-medium"
    >
      <span className={cn(
        'transition-opacity duration-200',
        language === 'en' ? 'opacity-100' : 'opacity-50'
      )}>
        EN
      </span>
      <span className="text-muted-foreground">/</span>
      <span className={cn(
        'font-bangla transition-opacity duration-200',
        language === 'bn' ? 'opacity-100' : 'opacity-50'
      )}>
        বাং
      </span>
    </Button>
  );
};

export default LanguageToggle;
