import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, CheckCircle2, Sparkles, Shield, Zap, Users, ArrowRight, TrendingUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBusinessInfoMap } from '@/hooks/useBusinessInfo';
import ScrollReveal from '@/components/common/ScrollReveal';
import CountUp from '@/components/common/CountUp';
import { Button } from '@/components/ui/button';
import ContactFormTabs from '@/components/contact/ContactFormTabs';
import contactHeroImg from '@/assets/contact-hero.jpg';

const services = [
  { value: 'web', labelEn: 'Web Development', labelBn: 'ওয়েব ডেভেলপমেন্ট' },
  { value: 'mobile', labelEn: 'Mobile Apps', labelBn: 'মোবাইল অ্যাপস' },
  { value: 'cloud', labelEn: 'Cloud Solutions', labelBn: 'ক্লাউড সলিউশন' },
  { value: 'security', labelEn: 'Cybersecurity', labelBn: 'সাইবার সিকিউরিটি' },
  { value: 'consulting', labelEn: 'IT Consulting', labelBn: 'আইটি পরামর্শ' },
  { value: 'analytics', labelEn: 'Data Analytics', labelBn: 'ডেটা অ্যানালিটিক্স' },
  { value: 'other', labelEn: 'Other', labelBn: 'অন্যান্য' }
];

const contactFeatures = [
  { icon: Shield, labelEn: 'Free Consultation', labelBn: 'বিনামূল্যে পরামর্শ' },
  { icon: Zap, labelEn: '24h Response Time', labelBn: '২৪ ঘন্টায় উত্তর' },
  { icon: Users, labelEn: 'Expert Team', labelBn: 'বিশেষজ্ঞ দল' }
];

const Contact = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('type') || 'contact';
  const { data: businessInfo } = useBusinessInfoMap();

  const getInfo = (key: string, fallbackEn: string, fallbackBn?: string) => {
    const info = businessInfo[key];
    if (info) {
      return language === 'en' ? (info.value_en || fallbackEn) : (info.value_bn || fallbackBn || fallbackEn);
    }
    return language === 'en' ? fallbackEn : (fallbackBn || fallbackEn);
  };

  return (
    <>
      <Helmet>
        <title>Hire Software Development Company in Bangladesh | Contact Creation Tech</title>
        <meta
          name="description"
          content="Hire expert software developers in Bangladesh. Get a custom software development quote, discuss your project requirements, and start your digital transformation journey."
        />
        <meta name="keywords" content="hire software development company, software development quote, hire developers Bangladesh, custom software pricing" />
        <link rel="canonical" href="https://creationtechbd.com/contact" />
      </Helmet>
      <Layout>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary)/0.08)] via-background to-[hsl(var(--accent)/0.06)] py-16 lg:py-24">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          <div className="absolute top-10 left-[10%] h-72 w-72 rounded-full bg-primary/8 blur-[100px] animate-[floatSlow_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-[10%] h-96 w-96 rounded-full bg-accent/10 blur-[120px] animate-[floatSlow_10s_ease-in-out_infinite_reverse]" />

          <div className="container-custom relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary ring-1 ring-primary/20 shadow-lg shadow-primary/5 hero-animate hero-animate-delay-0 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  {language === 'en' ? 'Get in Touch' : 'যোগাযোগ করুন'}
                </div>

                <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl hero-animate hero-animate-delay-1" style={{ letterSpacing: '-0.025em' }}>
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    {language === 'en' ? 'Hire Software Dev' : 'সফটওয়্যার ডেভেলপমেন্ট'}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    {language === 'en' ? 'Company in Bangladesh' : 'কোম্পানি নিয়োগ করুন'}
                  </span>
                </h1>

                <p className="max-w-xl text-lg text-muted-foreground leading-relaxed hero-animate hero-animate-delay-2 mx-auto lg:mx-0">
                  {language === 'en'
                    ? 'Ready to transform your business with cutting-edge technology? Our team is here to help you every step of the way.'
                    : 'আধুনিক প্রযুক্তি দিয়ে আপনার ব্যবসা রূপান্তর করতে প্রস্তুত? আমাদের দল প্রতিটি পদক্ষেপে আপনাকে সাহায্য করতে এখানে।'}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 hero-animate hero-animate-delay-3">
                  {contactFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-foreground/80 backdrop-blur-sm ring-1 ring-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                        <span>{language === 'en' ? feature.labelEn : feature.labelBn}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-6 max-w-md mx-auto lg:mx-0 hero-animate hero-animate-delay-4">
                  {[
                    { value: 200, suffix: '+', labelEn: 'Happy Clients', labelBn: 'সন্তুষ্ট ক্লায়েন্ট', icon: Users },
                    { value: 24, suffix: 'h', labelEn: 'Response Time', labelBn: 'রেসপন্স টাইম', icon: Zap },
                    { value: 98, suffix: '%', labelEn: 'Satisfaction', labelBn: 'সন্তুষ্টি', icon: TrendingUp },
                  ].map((stat, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex flex-col items-center p-3 sm:p-5 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors duration-300">
                        <stat.icon className="h-5 w-5 text-primary mb-2" />
                        <span className="text-xl sm:text-2xl font-bold text-foreground">
                          <CountUp end={stat.value} suffix={stat.suffix} />
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {language === 'en' ? stat.labelEn : stat.labelBn}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative hero-animate hero-animate-delay-2 hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20 rounded-3xl blur-2xl opacity-60" />
                  <div className="relative rounded-2xl overflow-hidden border border-border/30 shadow-2xl shadow-primary/10">
                    <img src={contactHeroImg} alt="CreationTech Team - Contact Us for Software Development" className="w-full h-auto object-cover" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-semibold shadow-lg shadow-primary/30 animate-[floatSlow_6s_ease-in-out_infinite]">
                    {language === 'en' ? '💬 Let\'s Talk' : '💬 কথা বলুন'}
                  </div>
                  <div className="absolute -bottom-3 -left-3 bg-background/90 backdrop-blur-md border border-border/50 rounded-xl px-4 py-2 text-sm font-medium shadow-lg animate-[floatSlow_7s_ease-in-out_infinite_reverse]">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      {language === 'en' ? 'Free Consultation' : 'বিনামূল্যে পরামর্শ'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Main Contact Section */}
        <section className="py-10 lg:py-14 bg-muted/30">
          <div className="container-custom">
            <div className="grid gap-12 lg:gap-16 lg:grid-cols-5">
              {/* Left Column - Contact Info & Map */}
              <div className="lg:col-span-2 space-y-8">
                <ScrollReveal>
                  <div>
                    <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-widest text-primary/80">
                      {language === 'en' ? 'REACH US' : 'আমাদের সাথে যোগাযোগ'}
                    </span>
                    <h2 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">
                      {language === 'en' ? 'Contact Information' : 'যোগাযোগের তথ্য'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Reach out to us through any of these channels.' : 'এই মাধ্যমগুলোর মাধ্যমে আমাদের সাথে যোগাযোগ করুন।'}
                    </p>
                  </div>
                </ScrollReveal>

                {/* Contact Cards */}
                <div className="space-y-3">
                  <ScrollReveal delay={0.1}>
                    <div className="group rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-all duration-200 group-hover:scale-110">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm mb-0.5">
                            {language === 'en' ? 'Office Address' : 'অফিসের ঠিকানা'}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {getInfo('address', 'House # 71, Road # 27, Gulshan-01, Dhaka', 'বাসা # ৭১, রোড # ২৭, গুলশান-০১, ঢাকা')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.15}>
                    <div className="group rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-all duration-200 group-hover:scale-110">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm mb-0.5">
                            {language === 'en' ? 'Phone' : 'ফোন'}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            <a href="tel:+8801833876434" className="hover:text-primary transition-colors font-medium">+880 1833-876434</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.2}>
                    <div className="group rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-all duration-200 group-hover:scale-110">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm mb-0.5">
                            {language === 'en' ? 'Email' : 'ইমেইল'}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            <a href="mailto:info@creationtechbd.com" className="hover:text-primary transition-colors font-medium">info@creationtechbd.com</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.25}>
                    <div className="group rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-all duration-200 group-hover:scale-110">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm mb-0.5">
                            {language === 'en' ? 'Business Hours' : 'ব্যবসায়িক সময়'}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {getInfo('business_hours', 'Sun - Thu: 9:00 AM - 6:00 PM', 'রবি - বৃহস্পতি: সকাল ৯:০০ - সন্ধ্যা ৬:০০')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Map */}
                <ScrollReveal delay={0.3}>
                  <div className="overflow-hidden rounded-xl border border-border/50 bg-muted shadow-lg">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0744892088814!2d90.41280187536068!3d23.782292178663987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a0f70dbd93%3A0x4c9e62d2f50a9a91!2sGulshan-1%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1704067200000!5m2!1sen!2sbd"
                      width="100%"
                      height="220"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="CreationTech Office Location"
                      className="grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Column - Forms */}
              <div className="lg:col-span-3">
                <ScrollReveal delay={0.1}>
                  <ContactFormTabs language={language} defaultTab={defaultTab} services={services} />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
