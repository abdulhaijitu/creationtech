import { Server, Gauge, Lock, Globe, Database, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';

const techHighlights = [
  {
    icon: Server,
    titleEn: 'Cloud-Ready Infrastructure',
    titleBn: 'ক্লাউড-রেডি ইনফ্রাস্ট্রাকচার',
    descEn: 'Built on top-tier cloud providers with auto-scaling capabilities for unlimited growth.',
    descBn: 'অসীম বৃদ্ধির জন্য অটো-স্কেলিং ক্ষমতা সহ শীর্ষ-স্তরের ক্লাউড প্রদানকারীদের উপর নির্মিত।',
    stat: '99.99%',
    statLabel: { en: 'Uptime SLA', bn: 'আপটাইম SLA' },
  },
  {
    icon: Gauge,
    titleEn: 'Lightning-Fast Response',
    titleBn: 'অতি দ্রুত রেসপন্স',
    descEn: 'Optimized for speed with edge caching and intelligent load distribution.',
    descBn: 'এজ ক্যাশিং এবং বুদ্ধিমান লোড ডিস্ট্রিবিউশন সহ গতির জন্য অপ্টিমাইজড।',
    stat: '<50ms',
    statLabel: { en: 'Avg Response', bn: 'গড় রেসপন্স' },
  },
  {
    icon: Lock,
    titleEn: 'Enterprise Security',
    titleBn: 'এন্টারপ্রাইজ সিকিউরিটি',
    descEn: 'End-to-end encryption, SOC2 compliance, and regular security audits.',
    descBn: 'এন্ড-টু-এন্ড এনক্রিপশন, SOC2 কমপ্লায়েন্স এবং নিয়মিত সিকিউরিটি অডিট।',
    stat: '256-bit',
    statLabel: { en: 'AES Encryption', bn: 'AES এনক্রিপশন' },
  },
];

const additionalFeatures = [
  {
    icon: Globe,
    titleEn: 'Global CDN',
    titleBn: 'গ্লোবাল CDN',
    descEn: 'Content delivered from 200+ edge locations worldwide.',
    descBn: 'বিশ্বব্যাপী ২০০+ এজ লোকেশন থেকে কন্টেন্ট ডেলিভারি।',
  },
  {
    icon: Database,
    titleEn: 'Data Redundancy',
    titleBn: 'ডেটা রিডান্ড্যান্সি',
    descEn: 'Automatic backups with multi-region replication.',
    descBn: 'মাল্টি-রিজিয়ন রেপ্লিকেশন সহ স্বয়ংক্রিয় ব্যাকআপ।',
  },
  {
    icon: RefreshCw,
    titleEn: 'Zero Downtime Updates',
    titleBn: 'জিরো ডাউনটাইম আপডেট',
    descEn: 'Seamless updates without service interruption.',
    descBn: 'সেবা বিঘ্ন ছাড়াই নির্বিঘ্ন আপডেট।',
  },
];

const ProductTechnology = () => {
  const { language } = useLanguage();

  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/3">
      <div className="container-custom">
        {/* Section Header */}
        <ScrollReveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            {language === 'en' ? 'Technology & Performance' : 'প্রযুক্তি ও পারফরম্যান্স'}
          </span>
          <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
            {language === 'en'
              ? 'Built for Reliability at Scale'
              : 'স্কেলে নির্ভরযোগ্যতার জন্য নির্মিত'}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {language === 'en'
              ? 'Enterprise-grade infrastructure that powers thousands of businesses worldwide.'
              : 'এন্টারপ্রাইজ-গ্রেড ইনফ্রাস্ট্রাকচার যা বিশ্বব্যাপী হাজার হাজার ব্যবসাকে শক্তি দেয়।'}
          </p>
        </ScrollReveal>

        {/* Main Highlights */}
        <div className="mb-12 grid gap-6 lg:grid-cols-3">
          {techHighlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={index} delay={index * 100} animation="scale-in">
                <div className="group rounded-2xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-250 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{item.stat}</div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'en' ? item.statLabel.en : item.statLabel.bn}
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-foreground">
                    {language === 'en' ? item.titleEn : item.titleBn}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {language === 'en' ? item.descEn : item.descBn}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="grid gap-4 sm:grid-cols-3">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={index} delay={300 + index * 80}>
                <div className="flex items-start gap-4 rounded-xl bg-muted/30 p-5 transition-all duration-200 hover:bg-muted/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium text-foreground">
                      {language === 'en' ? feature.titleEn : feature.titleBn}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? feature.descEn : feature.descBn}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductTechnology;
