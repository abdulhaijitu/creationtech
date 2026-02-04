import { Zap, TrendingUp, Shield, Layers } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';

const highlights = [
  {
    icon: Zap,
    titleEn: 'Lightning Fast',
    titleBn: 'অত্যন্ত দ্রুত',
    descEn: 'Sub-second response times',
    descBn: 'এক সেকেন্ডের কম রেসপন্স টাইম',
  },
  {
    icon: TrendingUp,
    titleEn: 'Infinitely Scalable',
    titleBn: 'অসীম স্কেলযোগ্য',
    descEn: 'Grow without limits',
    descBn: 'সীমাহীন বৃদ্ধি করুন',
  },
  {
    icon: Shield,
    titleEn: 'Enterprise Security',
    titleBn: 'এন্টারপ্রাইজ সিকিউরিটি',
    descEn: 'Bank-grade protection',
    descBn: 'ব্যাংক-গ্রেড সুরক্ষা',
  },
  {
    icon: Layers,
    titleEn: 'Smart Automation',
    titleBn: 'স্মার্ট অটোমেশন',
    descEn: 'AI-powered workflows',
    descBn: 'AI-চালিত ওয়ার্কফ্লো',
  },
];

const ProductOverview = () => {
  const { language } = useLanguage();

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <ScrollReveal>
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
                {language === 'en' ? 'Product Overview' : 'প্রোডাক্ট ওভারভিউ'}
              </span>
            </ScrollReveal>
            
            <ScrollReveal delay={80}>
              <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                {language === 'en'
                  ? 'Transform Complexity Into Simplicity'
                  : 'জটিলতাকে সরলতায় রূপান্তর করুন'}
              </h2>
            </ScrollReveal>
            
            <ScrollReveal delay={160}>
              <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
                {language === 'en'
                  ? 'Modern businesses struggle with fragmented tools, manual processes, and scaling challenges. CreationOS solves this by unifying your operations into one intelligent platform.'
                  : 'আধুনিক ব্যবসাগুলি বিচ্ছিন্ন টুলস, ম্যানুয়াল প্রক্রিয়া এবং স্কেলিং চ্যালেঞ্জের সাথে লড়াই করে। CreationOS আপনার অপারেশনগুলিকে একটি বুদ্ধিমান প্ল্যাটফর্মে একীভূত করে এটি সমাধান করে।'}
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={240}>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'en'
                  ? 'From automating repetitive tasks to providing real-time insights, we help you focus on what matters most — growing your business.'
                  : 'পুনরাবৃত্তিমূলক কাজ অটোমেট করা থেকে রিয়েল-টাইম ইনসাইট প্রদান পর্যন্ত, আমরা আপনাকে সবচেয়ে গুরুত্বপূর্ণ বিষয়ে ফোকাস করতে সাহায্য করি — আপনার ব্যবসা বৃদ্ধি করা।'}
              </p>
            </ScrollReveal>
          </div>
          
          {/* Highlights Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={index} delay={100 + index * 80} animation="scale-in">
                  <div className="group rounded-xl border border-border/50 bg-card p-6 transition-all duration-250 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-250 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      {language === 'en' ? item.titleEn : item.titleBn}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? item.descEn : item.descBn}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductOverview;
