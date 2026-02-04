import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageSection } from '@/hooks/usePageContent';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Shield, Scale, AlertCircle } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

interface LegalPageProps {
  pageSlug: string;
  fallbackTitle: string;
  fallbackTitleBn: string;
  fallbackContent: string;
  fallbackContentBn: string;
}

const pageIcons: Record<string, typeof FileText> = {
  terms: Scale,
  privacy: Shield,
  refund: AlertCircle,
  cookies: FileText,
};

const LegalPage = ({
  pageSlug,
  fallbackTitle,
  fallbackTitleBn,
  fallbackContent,
  fallbackContentBn,
}: LegalPageProps) => {
  const { language } = useLanguage();
  const { data: mainSection, isLoading } = usePageSection(pageSlug, 'main');

  const title = language === 'en'
    ? mainSection?.title_en || fallbackTitle
    : mainSection?.title_bn || fallbackTitleBn;

  const content = language === 'en'
    ? mainSection?.content_en || fallbackContent
    : mainSection?.content_bn || fallbackContentBn;

  const metaTitle = language === 'en'
    ? mainSection?.meta_title_en || `${fallbackTitle} - Creation Tech`
    : mainSection?.meta_title_bn || `${fallbackTitleBn} - Creation Tech`;

  const metaDescription = language === 'en'
    ? mainSection?.meta_description_en || fallbackTitle
    : mainSection?.meta_description_bn || fallbackTitleBn;

  const Icon = pageIcons[pageSlug] || FileText;

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={`https://creationtech.com/${pageSlug}`} />
      </Helmet>
      <Layout>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-20">
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }}
          />
          
          <div className="container-custom relative">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-primary/10 p-4">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                {title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {language === 'en'
                  ? 'Please read this document carefully before using our services.'
                  : 'আমাদের সেবা ব্যবহারের আগে অনুগ্রহ করে এই নথিটি মনোযোগ সহকারে পড়ুন।'}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Content Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="mx-auto max-w-4xl">
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-8 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-5/6 rounded-lg" />
                  <Skeleton className="h-8 w-2/3 rounded-lg mt-8" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-4/5 rounded-lg" />
                </div>
              ) : (
                <ScrollReveal delay={100}>
                  <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm lg:p-12">
                    <div 
                      className="prose prose-lg max-w-none dark:prose-invert
                        prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border/50
                        prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4
                        prose-p:text-muted-foreground prose-p:leading-relaxed
                        prose-strong:text-foreground prose-strong:font-semibold
                        prose-ul:text-muted-foreground prose-ul:my-4
                        prose-li:my-1 prose-li:leading-relaxed
                        prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                    
                    {/* Footer */}
                    <div className="mt-12 flex flex-col gap-4 border-t border-border/50 pt-8 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' 
                          ? `Last updated: ${mainSection?.updated_at ? new Date(mainSection.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}`
                          : `সর্বশেষ আপডেট: ${mainSection?.updated_at ? new Date(mainSection.updated_at).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }) : 'সম্প্রতি'}`
                        }
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>
                          {language === 'en' ? 'Legal Document' : 'আইনি নথি'}
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 lg:py-16 bg-muted/30 border-t border-border/30">
          <div className="container-custom">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <h2 className="mb-3 text-xl font-semibold">
                {language === 'en' ? 'Have Questions?' : 'প্রশ্ন আছে?'}
              </h2>
              <p className="mb-6 text-muted-foreground">
                {language === 'en'
                  ? 'If you have any questions about this policy, please contact us.'
                  : 'এই নীতি সম্পর্কে কোনো প্রশ্ন থাকলে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।'}
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
              >
                {language === 'en' ? 'Contact Us' : 'যোগাযোগ করুন'}
              </a>
            </ScrollReveal>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default LegalPage;
