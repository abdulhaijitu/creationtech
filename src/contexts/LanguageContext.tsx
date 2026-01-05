import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'Blog',
    'nav.pricing': 'Pricing',
    'nav.careers': 'Careers',
    'nav.contact': 'Contact',
    
    // Common
    'common.getQuote': 'Get a Quote',
    'common.contactUs': 'Contact Us',
    'common.bookMeeting': 'Book a Meeting',
    'common.learnMore': 'Learn More',
    'common.viewAll': 'View All',
    'common.readMore': 'Read More',
    'common.submit': 'Submit',
    'common.send': 'Send Message',
    'common.apply': 'Apply Now',
    
    // Hero
    'hero.title': 'Transforming Ideas Into Digital Reality',
    'hero.subtitle': 'We deliver innovative IT solutions that drive business growth and operational excellence.',
    'hero.cta.primary': 'Get Started',
    'hero.cta.secondary': 'View Our Work',
    
    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive IT solutions tailored to your business needs',
    
    // About
    'about.title': 'About Us',
    'about.subtitle': 'Your trusted partner in digital transformation',
    'about.mission': 'Our Mission',
    'about.vision': 'Our Vision',
    
    // Portfolio
    'portfolio.title': 'Our Portfolio',
    'portfolio.subtitle': 'Showcasing our successful projects and case studies',
    
    // Blog
    'blog.title': 'Latest Insights',
    'blog.subtitle': 'Stay updated with the latest trends and insights in technology',
    
    // Pricing
    'pricing.title': 'Pricing',
    'pricing.subtitle': 'Transparent pricing for quality services',
    
    // Careers
    'careers.title': 'Join Our Team',
    'careers.subtitle': 'Build your career with us',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with our team',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.service': 'Service Interest',
    'contact.form.message': 'Your Message',
    
    // Footer
    'footer.description': 'Creation Tech is a leading IT solutions company delivering innovative digital services to businesses worldwide.',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.contact': 'Contact Info',
    'footer.newsletter': 'Newsletter',
    'footer.newsletterText': 'Subscribe to our newsletter for updates',
    'footer.copyright': '© 2025 Creation Tech. All rights reserved.',
    
    // Trust indicators
    'trust.yearsExperience': 'Years Experience',
    'trust.projectsDelivered': 'Projects Delivered',
    'trust.happyClients': 'Happy Clients',
    'trust.teamMembers': 'Team Members',
  },
  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.about': 'আমাদের সম্পর্কে',
    'nav.services': 'সেবাসমূহ',
    'nav.portfolio': 'পোর্টফোলিও',
    'nav.blog': 'ব্লগ',
    'nav.pricing': 'মূল্য তালিকা',
    'nav.careers': 'ক্যারিয়ার',
    'nav.contact': 'যোগাযোগ',
    
    // Common
    'common.getQuote': 'কোটেশন নিন',
    'common.contactUs': 'যোগাযোগ করুন',
    'common.bookMeeting': 'মিটিং বুক করুন',
    'common.learnMore': 'আরও জানুন',
    'common.viewAll': 'সব দেখুন',
    'common.readMore': 'আরও পড়ুন',
    'common.submit': 'জমা দিন',
    'common.send': 'বার্তা পাঠান',
    'common.apply': 'আবেদন করুন',
    
    // Hero
    'hero.title': 'ধারণাকে ডিজিটাল বাস্তবতায় রূপান্তর',
    'hero.subtitle': 'আমরা উদ্ভাবনী আইটি সমাধান সরবরাহ করি যা ব্যবসায়িক বৃদ্ধি এবং অপারেশনাল শ্রেষ্ঠত্ব চালিত করে।',
    'hero.cta.primary': 'শুরু করুন',
    'hero.cta.secondary': 'আমাদের কাজ দেখুন',
    
    // Services
    'services.title': 'আমাদের সেবাসমূহ',
    'services.subtitle': 'আপনার ব্যবসার প্রয়োজন অনুযায়ী সম্পূর্ণ আইটি সমাধান',
    
    // About
    'about.title': 'আমাদের সম্পর্কে',
    'about.subtitle': 'ডিজিটাল রূপান্তরে আপনার বিশ্বস্ত অংশীদার',
    'about.mission': 'আমাদের মিশন',
    'about.vision': 'আমাদের ভিশন',
    
    // Portfolio
    'portfolio.title': 'আমাদের পোর্টফোলিও',
    'portfolio.subtitle': 'আমাদের সফল প্রকল্প এবং কেস স্টাডি প্রদর্শন',
    
    // Blog
    'blog.title': 'সর্বশেষ অন্তর্দৃষ্টি',
    'blog.subtitle': 'প্রযুক্তির সর্বশেষ ট্রেন্ড এবং অন্তর্দৃষ্টি সম্পর্কে আপডেট থাকুন',
    
    // Pricing
    'pricing.title': 'মূল্য তালিকা',
    'pricing.subtitle': 'মানসম্পন্ন সেবার জন্য স্বচ্ছ মূল্য',
    
    // Careers
    'careers.title': 'আমাদের দলে যোগ দিন',
    'careers.subtitle': 'আমাদের সাথে আপনার ক্যারিয়ার গড়ুন',
    
    // Contact
    'contact.title': 'যোগাযোগ করুন',
    'contact.subtitle': 'আমাদের দলের সাথে যোগাযোগ করুন',
    'contact.form.name': 'পুরো নাম',
    'contact.form.email': 'ইমেইল ঠিকানা',
    'contact.form.phone': 'ফোন নম্বর',
    'contact.form.service': 'সেবায় আগ্রহী',
    'contact.form.message': 'আপনার বার্তা',
    
    // Footer
    'footer.description': 'Creation Tech একটি শীর্ষস্থানীয় আইটি সলিউশন কোম্পানি যা বিশ্বব্যাপী ব্যবসায়গুলিতে উদ্ভাবনী ডিজিটাল সেবা সরবরাহ করে।',
    'footer.quickLinks': 'দ্রুত লিঙ্ক',
    'footer.services': 'সেবাসমূহ',
    'footer.contact': 'যোগাযোগের তথ্য',
    'footer.newsletter': 'নিউজলেটার',
    'footer.newsletterText': 'আপডেটের জন্য আমাদের নিউজলেটারে সাবস্ক্রাইব করুন',
    'footer.copyright': '© ২০২৫ Creation Tech। সর্বস্বত্ব সংরক্ষিত।',
    
    // Trust indicators
    'trust.yearsExperience': 'বছরের অভিজ্ঞতা',
    'trust.projectsDelivered': 'প্রকল্প সম্পন্ন',
    'trust.happyClients': 'সন্তুষ্ট ক্লায়েন্ট',
    'trust.teamMembers': 'দলের সদস্য',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
