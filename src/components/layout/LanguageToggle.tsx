import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

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
