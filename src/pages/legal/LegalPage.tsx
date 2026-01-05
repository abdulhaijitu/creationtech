import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageSection } from '@/hooks/usePageContent';
import { Skeleton } from '@/components/ui/skeleton';

interface LegalPageProps {
  pageSlug: string;
  fallbackTitle: string;
  fallbackTitleBn: string;
  fallbackContent: string;
  fallbackContentBn: string;
}

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

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={`https://creationtech.com/${pageSlug}`} />
      </Helmet>
      <Layout>
        <section className="section-padding bg-section-light">
          <div className="container-custom">
            <div className="mx-auto max-w-4xl">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <>
                  <h1 className="mb-8 text-3xl font-bold sm:text-4xl">{title}</h1>
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert
                      prose-headings:text-foreground prose-headings:font-semibold
                      prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                      prose-p:text-muted-foreground prose-p:leading-relaxed
                      prose-strong:text-foreground
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                  <div className="mt-12 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? `Last updated: ${mainSection?.updated_at ? new Date(mainSection.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}`
                        : `সর্বশেষ আপডেট: ${mainSection?.updated_at ? new Date(mainSection.updated_at).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }) : 'সম্প্রতি'}`
                      }
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default LegalPage;
