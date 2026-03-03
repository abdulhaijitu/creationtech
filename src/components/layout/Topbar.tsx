import { Mail, Phone, LogIn, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useBusinessInfoMap } from '@/hooks/useBusinessInfo';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.528 5.861L.06 23.487a.5.5 0 00.613.613l5.626-1.468A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.33-1.542.5.5 0 00-.386-.06l-3.728.972.972-3.728a.5.5 0 00-.06-.386A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
  </svg>
);

const socialLinks = [
  { icon: Facebook, key: 'social_facebook', label: 'Facebook' },
  { icon: Twitter, key: 'social_twitter', label: 'Twitter' },
  { icon: Linkedin, key: 'social_linkedin', label: 'LinkedIn' },
  { icon: Instagram, key: 'social_instagram', label: 'Instagram' },
  { icon: WhatsAppIcon, key: 'social_whatsapp', label: 'WhatsApp' },
];

const Topbar = () => {
  const { data: businessInfo } = useBusinessInfoMap();

  const getInfo = (key: string, fallback: string) => businessInfo[key]?.value_en || fallback;
  const getSocialLink = (key: string) => getInfo(key, '#');

  return (
    <div className="hidden lg:block w-full bg-background border-b border-border/30">
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
