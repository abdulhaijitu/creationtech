import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from '@/components/common/FloatingButtons';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Layout;
