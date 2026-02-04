import { useState, useEffect } from 'react';
import { Mail, Phone, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { cn } from '@/lib/utils';

interface TopbarProps {
  isVisible: boolean;
}

const Topbar = ({ isVisible }: TopbarProps) => {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        'hidden lg:block w-full bg-muted/50 border-b border-border/30 transition-all duration-300 ease-out overflow-hidden',
        isVisible ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'
      )}
    >
      <div className="container-custom">
        <div className="flex h-10 items-center justify-between text-sm">
          {/* Left Side - Contact Info */}
          <div className="flex items-center gap-6 text-muted-foreground">
            <a
              href="mailto:info@creationtechbd.com"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>info@creationtechbd.com</span>
            </a>
            <a
              href="tel:+8801833876434"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>01833876434</span>
            </a>
          </div>

          {/* Right Side - Language & Login */}
          <div className="flex items-center gap-4">
            <LanguageToggle variant="minimal" />
            <div className="h-4 w-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-3 text-muted-foreground hover:text-foreground"
            >
              <Link to="/admin/login" className="flex items-center gap-2">
                <LogIn className="h-3.5 w-3.5" />
                <span>{t('common.login') || 'Login'}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
