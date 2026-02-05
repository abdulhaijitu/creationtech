import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const blogPosts = [
  {
    id: '1',
    slug: 'future-of-cloud-computing-2025',
    titleEn: 'The Future of Cloud Computing in 2025',
    titleBn: '২০২৫ সালে ক্লাউড কম্পিউটিংয়ের ভবিষ্যৎ',
    excerptEn: 'Explore the emerging trends and technologies shaping the future of cloud computing and how businesses can prepare.',
    excerptBn: 'ক্লাউড কম্পিউটিংয়ের ভবিষ্যৎ গঠনকারী উদীয়মান ট্রেন্ড এবং প্রযুক্তি অন্বেষণ করুন।',
    author: 'Rahman Khan',
    date: '2024-12-15',
    category: 'Cloud',
    tags: ['Cloud Computing', 'Technology Trends', 'Digital Transformation'],
    image: '/placeholder.svg',
  },
  {
    id: '2',
    slug: 'cybersecurity-best-practices-sme',
    titleEn: 'Cybersecurity Best Practices for SMEs',
    titleBn: 'এসএমইদের জন্য সাইবার সিকিউরিটি সেরা অনুশীলন',
    excerptEn: 'Essential security measures every small and medium business should implement to protect against cyber threats.',
    excerptBn: 'প্রতিটি ছোট এবং মাঝারি ব্যবসার সাইবার হুমকি থেকে রক্ষা করতে প্রয়োজনীয় নিরাপত্তা ব্যবস্থা।',
    author: 'Fatima Akter',
    date: '2024-12-10',
    category: 'Security',
    tags: ['Cybersecurity', 'SME', 'Best Practices'],
    image: '/placeholder.svg',
  },
  {
    id: '3',
    slug: 'mobile-app-development-trends',
    titleEn: 'Mobile App Development Trends to Watch',
    titleBn: 'লক্ষ্য রাখার মতো মোবাইল অ্যাপ ডেভেলপমেন্ট ট্রেন্ড',
    excerptEn: 'From AI integration to cross-platform development, discover the trends defining mobile app development.',
    excerptBn: 'AI ইন্টিগ্রেশন থেকে ক্রস-প্ল্যাটফর্ম ডেভেলপমেন্ট পর্যন্ত, মোবাইল অ্যাপ ডেভেলপমেন্ট সংজ্ঞায়িত ট্রেন্ডগুলি আবিষ্কার করুন।',
    author: 'Imran Hossain',
    date: '2024-12-05',
    category: 'Development',
    tags: ['Mobile Apps', 'React Native', 'Flutter', 'AI'],
    image: '/placeholder.svg',
  },
  {
    id: '4',
    slug: 'digital-transformation-guide',
    titleEn: 'A Complete Guide to Digital Transformation',
    titleBn: 'ডিজিটাল ট্রান্সফর্মেশনের সম্পূর্ণ গাইড',
    excerptEn: 'Learn how to successfully navigate digital transformation and modernize your business operations.',
    excerptBn: 'কীভাবে সফলভাবে ডিজিটাল ট্রান্সফর্মেশন নেভিগেট করবেন এবং আপনার ব্যবসা অপারেশন আধুনিকীকরণ করবেন।',
    author: 'Sakib Ahmed',
    date: '2024-11-28',
    category: 'Strategy',
    tags: ['Digital Transformation', 'Business Strategy', 'Technology'],
    image: '/placeholder.svg',
  },
  {
    id: '5',
    slug: 'choosing-right-tech-stack',
    titleEn: 'Choosing the Right Tech Stack for Your Project',
    titleBn: 'আপনার প্রকল্পের জন্য সঠিক টেক স্ট্যাক বেছে নেওয়া',
    excerptEn: 'A comprehensive guide to selecting the best technologies for your web or mobile application project.',
    excerptBn: 'আপনার ওয়েব বা মোবাইল অ্যাপ্লিকেশন প্রকল্পের জন্য সেরা প্রযুক্তি নির্বাচনের জন্য একটি ব্যাপক গাইড।',
    author: 'Nadia Islam',
    date: '2024-11-20',
    category: 'Development',
    tags: ['Tech Stack', 'Web Development', 'Architecture'],
    image: '/placeholder.svg',
  },
  {
    id: '6',
    slug: 'data-analytics-business-growth',
    titleEn: 'Leveraging Data Analytics for Business Growth',
    titleBn: 'ব্যবসায়িক বৃদ্ধির জন্য ডেটা অ্যানালিটিক্স ব্যবহার',
    excerptEn: 'Discover how data analytics can provide valuable insights and drive strategic business decisions.',
    excerptBn: 'কীভাবে ডেটা অ্যানালিটিক্স মূল্যবান অন্তর্দৃষ্টি প্রদান করতে এবং কৌশলগত ব্যবসায়িক সিদ্ধান্ত চালিত করতে পারে।',
    author: 'Tanvir Rahman',
    date: '2024-11-15',
    category: 'Analytics',
    tags: ['Data Analytics', 'Business Intelligence', 'Growth'],
    image: '/placeholder.svg',
  },
];

const categories = ['All', 'Cloud', 'Security', 'Development', 'Strategy', 'Analytics'];

const Blog = () => {
  const { t, language } = useLanguage();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return language === 'en'
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <Helmet>
        <title>Software Development Insights & Technology Blog | Creation Tech</title>
        <meta
          name="description"
          content="Expert software development insights, technology blog, and business automation guides. Stay updated with the latest software development tips and industry best practices."
        />
        <meta name="keywords" content="software development insights, technology blog, software development tips, business automation guides" />
        <link rel="canonical" href="https://creationtechbd.com/blog" />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="gradient-hero py-24 lg:py-32">
          <div className="container-custom text-center">
            <h1 className="mb-5 text-4xl font-bold text-primary-foreground sm:text-5xl animate-fade-up" style={{ letterSpacing: '-0.03em' }}>
              {t('blog.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/75 leading-relaxed animate-fade-up animation-delay-100">
              {t('blog.subtitle')}
            </p>
          </div>
        </section>

        {/* Categories */}
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

        {/* Blog Posts */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden card-interactive border-border/40">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={post.image}
                      alt={language === 'en' ? post.titleEn : post.titleBn}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {post.author}
                      </span>
                    </div>
                    <Badge variant="secondary" className="w-fit mb-3 text-xs font-medium">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-lg font-semibold leading-snug">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="hover:text-primary transition-colors duration-200"
                      >
                        {language === 'en' ? post.titleEn : post.titleBn}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {language === 'en' ? post.excerptEn : post.excerptBn}
                    </p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/80 group/link"
                    >
                      {t('common.readMore')}
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="section-padding bg-section-alt">
          <div className="container-narrow text-center">
            <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {language === 'en' ? 'Subscribe to Our Newsletter' : 'আমাদের নিউজলেটারে সাবস্ক্রাইব করুন'}
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground leading-relaxed">
              {language === 'en'
                ? 'Get the latest articles, insights, and updates delivered directly to your inbox.'
                : 'সর্বশেষ নিবন্ধ, অন্তর্দৃষ্টি এবং আপডেট সরাসরি আপনার ইনবক্সে পান।'}
            </p>
            <div className="mx-auto flex max-w-md gap-3">
              <Input
                type="email"
                placeholder={language === 'en' ? 'Enter your email' : 'আপনার ইমেইল লিখুন'}
                className="flex-1"
              />
              <Button>
                {language === 'en' ? 'Subscribe' : 'সাবস্ক্রাইব'}
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Blog;
