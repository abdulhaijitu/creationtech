import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
        <title>Blog - Creation Tech | Technology Insights & News</title>
        <meta
          name="description"
          content="Stay updated with the latest technology trends, insights, and best practices from the Creation Tech team."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="gradient-hero py-20 lg:py-28">
          <div className="container-custom text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground sm:text-5xl">
              {t('blog.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
              {t('blog.subtitle')}
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="border-b border-border py-6">
          <div className="container-custom">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === 'All' ? 'default' : 'outline'}
                  size="sm"
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
                <Card key={post.id} className="group overflow-hidden hover-lift">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={post.image}
                      alt={language === 'en' ? post.titleEn : post.titleBn}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {post.author}
                      </span>
                    </div>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-xl leading-tight line-clamp-2">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {language === 'en' ? post.titleEn : post.titleBn}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {language === 'en' ? post.excerptEn : post.excerptBn}
                    </p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      {t('common.readMore')}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="section-padding bg-section-alt">
          <div className="container-custom text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {language === 'en' ? 'Subscribe to Our Newsletter' : 'আমাদের নিউজলেটারে সাবস্ক্রাইব করুন'}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              {language === 'en'
                ? 'Get the latest articles, insights, and updates delivered directly to your inbox.'
                : 'সর্বশেষ নিবন্ধ, অন্তর্দৃষ্টি এবং আপডেট সরাসরি আপনার ইনবক্সে পান।'}
            </p>
            <div className="mx-auto flex max-w-md gap-2">
              <input
                type="email"
                placeholder={language === 'en' ? 'Enter your email' : 'আপনার ইমেইল লিখুন'}
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
