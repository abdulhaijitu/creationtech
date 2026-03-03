import { Mail, Phone, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TopbarProps {
  isVisible: boolean;
}

const Topbar = ({ isVisible }: TopbarProps) => {

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
              href="mailto:info@creationtechbd.com"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:text-foreground hover:bg-accent/50"
            >
              <Mail className="h-3.5 w-3.5 text-primary/70" />
              <span>info@creationtechbd.com</span>
            </a>
            <span className="text-border">•</span>
            <a
              href="tel:+8801833876434"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:text-foreground hover:bg-accent/50"
            >
              <Phone className="h-3.5 w-3.5 text-primary/70" />
              <span>+880 1833-876434</span>
            </a>
          </div>

          {/* Right Side - Language & Login */}
          <div className="flex items-center gap-3">
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
