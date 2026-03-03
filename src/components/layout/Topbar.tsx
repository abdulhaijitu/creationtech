import { Mail, Phone, LogIn, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useBusinessInfoMap } from '@/hooks/useBusinessInfo';

interface TopbarProps {
  isVisible: boolean;
}

const socialLinks = [
  { icon: Facebook, key: 'social_facebook', label: 'Facebook' },
  { icon: Twitter, key: 'social_twitter', label: 'Twitter' },
  { icon: Linkedin, key: 'social_linkedin', label: 'LinkedIn' },
  { icon: Instagram, key: 'social_instagram', label: 'Instagram' },
];

const Topbar = ({ isVisible }: TopbarProps) => {
  const { data: businessInfo } = useBusinessInfoMap();

  const getInfo = (key: string, fallback: string) => businessInfo[key]?.value_en || fallback;
  const getSocialLink = (key: string) => getInfo(key, '#');

  return (
    <div
      className={cn(
        'hidden lg:block w-full bg-gradient-to-r from-primary/5 via-background to-primary/5 border-b border-border/30 transition-all duration-300 ease-out overflow-hidden',
        isVisible ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'
      )}
    >
      <div className="container-custom">
        <div className="flex h-10 items-center justify-between text-sm">
          {/* Left Side - Contact Info */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <a
              href={`mailto:${getInfo('email', 'info@creationtechbd.com')}`}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:text-foreground hover:bg-accent/50"
            >
              <Mail className="h-3.5 w-3.5 text-primary/70" />
              <span>{getInfo('email', 'info@creationtechbd.com')}</span>
            </a>
            <span className="text-border">•</span>
            <a
              href={`tel:${getInfo('phone', '+8801833876434')}`}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:text-foreground hover:bg-accent/50"
            >
              <Phone className="h-3.5 w-3.5 text-primary/70" />
              <span>{getInfo('phone', '+880 1833-876434')}</span>
            </a>
          </div>

          {/* Right Side - Social & Login */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.key}
                href={getSocialLink(social.key)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:text-primary hover:bg-primary/10"
              >
                <social.icon className="h-3.5 w-3.5" />
              </a>
            ))}
            <div className="h-4 w-px bg-border/60 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-7 px-2.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5"
            >
              <Link to="/admin/login" className="flex items-center gap-1.5">
                <LogIn className="h-3 w-3" />
                <span>Login</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
