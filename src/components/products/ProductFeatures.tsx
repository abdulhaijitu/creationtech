import { 
  Cpu, 
  BarChart3, 
  Cloud, 
  Plug, 
  Bell, 
  Users,
  FileCode,
  Workflow
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Cpu,
    titleEn: 'Smart Automation Engine',
    titleBn: 'স্মার্ট অটোমেশন ইঞ্জিন',
    descEn: 'Automate repetitive tasks with AI-powered workflows that learn and adapt to your business needs.',
    descBn: 'AI-চালিত ওয়ার্কফ্লো দিয়ে পুনরাবৃত্তিমূলক কাজ অটোমেট করুন যা আপনার ব্যবসার প্রয়োজনে শেখে এবং অভিযোজিত হয়।',
  },
  {
    icon: BarChart3,
    titleEn: 'Real-time Analytics Dashboard',
    titleBn: 'রিয়েল-টাইম অ্যানালিটিক্স ড্যাশবোর্ড',
    descEn: 'Get instant insights with beautiful visualizations and actionable metrics at your fingertips.',
    descBn: 'সুন্দর ভিজ্যুয়ালাইজেশন এবং কার্যকরী মেট্রিক্স সহ তাৎক্ষণিক ইনসাইট পান।',
  },
  {
    icon: Cloud,
    titleEn: 'Secure Cloud Architecture',
    titleBn: 'নিরাপদ ক্লাউড আর্কিটেকচার',
    descEn: 'Enterprise-grade security with end-to-end encryption and compliance-ready infrastructure.',
    descBn: 'এন্ড-টু-এন্ড এনক্রিপশন এবং কমপ্লায়েন্স-রেডি ইনফ্রাস্ট্রাকচার সহ এন্টারপ্রাইজ-গ্রেড সিকিউরিটি।',
  },
  {
    icon: Plug,
    titleEn: 'Easy Integration & API',
    titleBn: 'সহজ ইন্টিগ্রেশন ও API',
    descEn: 'Connect with 100+ tools seamlessly. RESTful APIs and webhooks for custom integrations.',
    descBn: '১০০+ টুলসের সাথে নির্বিঘ্নে সংযুক্ত হোন। কাস্টম ইন্টিগ্রেশনের জন্য RESTful APIs এবং webhooks।',
  },
  {
    icon: Bell,
    titleEn: 'Smart Notifications',
    titleBn: 'স্মার্ট নোটিফিকেশন',
    descEn: 'Stay informed with intelligent alerts across email, SMS, and push notifications.',
    descBn: 'ইমেইল, SMS এবং পুশ নোটিফিকেশন জুড়ে বুদ্ধিমান অ্যালার্ট দিয়ে অবগত থাকুন।',
  },
  {
    icon: Users,
    titleEn: 'Team Collaboration',
    titleBn: 'টিম কোলাবোরেশন',
    descEn: 'Work together seamlessly with role-based access, comments, and real-time updates.',
    descBn: 'রোল-ভিত্তিক অ্যাক্সেস, মন্তব্য এবং রিয়েল-টাইম আপডেট সহ নির্বিঘ্নে একসাথে কাজ করুন।',
  },
  {
    icon: FileCode,
    titleEn: 'Custom Workflows',
    titleBn: 'কাস্টম ওয়ার্কফ্লো',
    descEn: 'Build custom automation flows with our drag-and-drop visual editor.',
    descBn: 'আমাদের ড্র্যাগ-এন্ড-ড্রপ ভিজ্যুয়াল এডিটর দিয়ে কাস্টম অটোমেশন ফ্লো তৈরি করুন।',
  },
  {
    icon: Workflow,
    titleEn: 'Process Optimization',
    titleBn: 'প্রসেস অপ্টিমাইজেশন',
    descEn: 'Identify bottlenecks and optimize workflows with AI-driven recommendations.',
    descBn: 'AI-চালিত সুপারিশ সহ বাধা চিহ্নিত করুন এবং ওয়ার্কফ্লো অপ্টিমাইজ করুন।',
  },
];

const ProductFeatures = () => {
  const { language } = useLanguage();

  return (
    <section className="section-padding bg-section-light">
      <div className="container-custom">
        {/* Section Header */}
        <ScrollReveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            {language === 'en' ? 'Key Features' : 'মূল বৈশিষ্ট্য'}
          </span>
          <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
            {language === 'en'
              ? 'Everything You Need to Succeed'
              : 'সফল হতে আপনার যা দরকার সব'}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {language === 'en'
              ? 'Powerful features designed to help modern businesses operate efficiently and scale confidently.'
              : 'আধুনিক ব্যবসাগুলিকে দক্ষতার সাথে পরিচালনা করতে এবং আত্মবিশ্বাসের সাথে স্কেল করতে সাহায্য করার জন্য ডিজাইন করা শক্তিশালী বৈশিষ্ট্য।'}
          </p>
        </ScrollReveal>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={index} delay={index * 60} duration={400}>
                <Card className="group h-full border-border/40 transition-all duration-250 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.03]">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-250 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">
                      {language === 'en' ? feature.titleEn : feature.titleBn}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {language === 'en' ? feature.descEn : feature.descBn}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductFeatures;
