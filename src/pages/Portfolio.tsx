import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const projects = [
  {
    id: '1',
    titleEn: 'E-Commerce Platform',
    titleBn: 'ই-কমার্স প্ল্যাটফর্ম',
    category: 'Web Development',
    clientEn: 'RetailMax Bangladesh',
    clientBn: 'রিটেইলম্যাক্স বাংলাদেশ',
    descEn: 'A full-featured e-commerce platform with inventory management, payment processing, and customer analytics.',
    descBn: 'ইনভেন্টরি ম্যানেজমেন্ট, পেমেন্ট প্রসেসিং এবং কাস্টমার অ্যানালিটিক্স সহ সম্পূর্ণ ই-কমার্স প্ল্যাটফর্ম।',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    resultEn: '150% increase in online sales within 6 months',
    resultBn: '৬ মাসের মধ্যে অনলাইন বিক্রয়ে ১৫০% বৃদ্ধি',
    image: '/placeholder.svg',
  },
  {
    id: '2',
    titleEn: 'Healthcare Mobile App',
    titleBn: 'স্বাস্থ্যসেবা মোবাইল অ্যাপ',
    category: 'Mobile Development',
    clientEn: 'MediCare Plus',
    clientBn: 'মেডিকেয়ার প্লাস',
    descEn: 'A patient-doctor communication app with appointment booking, prescription management, and telemedicine features.',
    descBn: 'অ্যাপয়েন্টমেন্ট বুকিং, প্রেসক্রিপশন ম্যানেজমেন্ট এবং টেলিমেডিসিন ফিচার সহ রোগী-ডাক্তার যোগাযোগ অ্যাপ।',
    tags: ['React Native', 'Firebase', 'WebRTC'],
    resultEn: '50,000+ active users in first year',
    resultBn: 'প্রথম বছরে ৫০,০০০+ সক্রিয় ব্যবহারকারী',
    image: '/placeholder.svg',
  },
  {
    id: '3',
    titleEn: 'Cloud Migration Project',
    titleBn: 'ক্লাউড মাইগ্রেশন প্রজেক্ট',
    category: 'Cloud Solutions',
    clientEn: 'FinServ Corporation',
    clientBn: 'ফিনসার্ভ কর্পোরেশন',
    descEn: 'Complete migration of legacy infrastructure to AWS with zero downtime and enhanced security.',
    descBn: 'শূন্য ডাউনটাইম এবং উন্নত নিরাপত্তা সহ AWS-এ লিগ্যাসি ইনফ্রাস্ট্রাকচারের সম্পূর্ণ মাইগ্রেশন।',
    tags: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    resultEn: '40% reduction in infrastructure costs',
    resultBn: 'ইনফ্রাস্ট্রাকচার খরচে ৪০% হ্রাস',
    image: '/placeholder.svg',
  },
  {
    id: '4',
    titleEn: 'Security Audit & Implementation',
    titleBn: 'সিকিউরিটি অডিট এবং বাস্তবায়ন',
    category: 'Cybersecurity',
    clientEn: 'National Bank Ltd',
    clientBn: 'ন্যাশনাল ব্যাংক লিমিটেড',
    descEn: 'Comprehensive security audit followed by implementation of enterprise-grade security measures.',
    descBn: 'এন্টারপ্রাইজ-গ্রেড নিরাপত্তা ব্যবস্থা বাস্তবায়ন সহ ব্যাপক নিরাপত্তা অডিট।',
    tags: ['Penetration Testing', 'SIEM', 'Compliance'],
    resultEn: 'Achieved ISO 27001 certification',
    resultBn: 'ISO 27001 সার্টিফিকেশন অর্জন',
    image: '/placeholder.svg',
  },
  {
    id: '5',
    titleEn: 'Business Intelligence Dashboard',
    titleBn: 'বিজনেস ইন্টেলিজেন্স ড্যাশবোর্ড',
    category: 'Data Analytics',
    clientEn: 'LogiTech Solutions',
    clientBn: 'লজিটেক সলিউশনস',
    descEn: 'Real-time analytics dashboard providing insights into logistics operations and supply chain efficiency.',
    descBn: 'লজিস্টিক্স অপারেশন এবং সাপ্লাই চেইন দক্ষতার অন্তর্দৃষ্টি প্রদানকারী রিয়েল-টাইম অ্যানালিটিক্স ড্যাশবোর্ড।',
    tags: ['Power BI', 'Python', 'Machine Learning'],
    resultEn: '25% improvement in delivery efficiency',
    resultBn: 'ডেলিভারি দক্ষতায় ২৫% উন্নতি',
    image: '/placeholder.svg',
  },
  {
    id: '6',
    titleEn: 'Corporate Website Redesign',
    titleBn: 'কর্পোরেট ওয়েবসাইট রিডিজাইন',
    category: 'UI/UX Design',
    clientEn: 'TechVentures BD',
    clientBn: 'টেকভেঞ্চার্স বিডি',
    descEn: 'Complete redesign of corporate website with focus on user experience and lead generation.',
    descBn: 'ব্যবহারকারীর অভিজ্ঞতা এবং লিড জেনারেশনের উপর ফোকাস সহ কর্পোরেট ওয়েবসাইটের সম্পূর্ণ রিডিজাইন।',
    tags: ['Figma', 'React', 'Tailwind CSS', 'Next.js'],
    resultEn: '200% increase in lead conversion',
    resultBn: 'লিড রূপান্তরে ২০০% বৃদ্ধি',
    image: '/placeholder.svg',
  },
];

const categories = ['All', 'Web Development', 'Mobile Development', 'Cloud Solutions', 'Cybersecurity', 'Data Analytics', 'UI/UX Design'];

const Portfolio = () => {
  const { t, language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Portfolio - Creation Tech | Our Work & Case Studies</title>
        <meta
          name="description"
          content="Explore Creation Tech's portfolio of successful projects including web development, mobile apps, cloud solutions, and more."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="gradient-hero py-24 lg:py-32">
          <div className="container-custom text-center">
            <h1 className="mb-5 text-4xl font-bold text-primary-foreground sm:text-5xl animate-fade-up" style={{ letterSpacing: '-0.03em' }}>
              {t('portfolio.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/75 leading-relaxed animate-fade-up animation-delay-100">
              {t('portfolio.subtitle')}
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="border-b border-border/50 py-6">
          <div className="container-custom">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === 'All' ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="group overflow-hidden card-interactive border-border/40">
                  {/* Image */}
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={project.image}
                      alt={language === 'en' ? project.titleEn : project.titleBn}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="mb-3">
                      <Badge variant="secondary" className="text-xs font-medium">{project.category}</Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold leading-snug">
                      {language === 'en' ? project.titleEn : project.titleBn}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {language === 'en' ? project.clientEn : project.clientBn}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {language === 'en' ? project.descEn : project.descBn}
                    </p>
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="rounded-lg bg-accent/8 p-4 border border-accent/15">
                      <p className="text-sm font-medium text-accent">
                        {language === 'en' ? project.resultEn : project.resultBn}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-section-alt">
          <div className="container-custom text-center">
            <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {language === 'en' ? 'Ready to Start Your Project?' : 'আপনার প্রকল্প শুরু করতে প্রস্তুত?'}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              {language === 'en'
                ? "Let's discuss how we can help bring your ideas to life."
                : 'আসুন আলোচনা করি কীভাবে আমরা আপনার ধারণাগুলি বাস্তবায়িত করতে সাহায্য করতে পারি।'}
            </p>
            <Button size="lg" asChild className="group">
              <Link to="/contact">
                {t('common.getQuote')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Portfolio;
