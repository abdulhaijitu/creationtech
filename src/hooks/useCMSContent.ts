import { usePageContent, PageContent } from '@/hooks/usePageContent';
import { useLanguage } from '@/contexts/LanguageContext';

interface CMSContentOptions {
  pageSlug: string;
}

interface CMSSection {
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  raw?: PageContent;
}

export const useCMSContent = ({ pageSlug }: CMSContentOptions) => {
  const { language } = useLanguage();
  const { data: sections, isLoading, error } = usePageContent(pageSlug);

  const getSection = (sectionKey: string, fallbacks?: { title?: string; content?: string }): CMSSection => {
    const section = sections?.find((s) => s.section_key === sectionKey);

    if (section) {
      return {
        title: (language === 'en' ? section.title_en : section.title_bn) || fallbacks?.title || '',
        content: (language === 'en' ? section.content_en : section.content_bn) || fallbacks?.content || '',
        metaTitle: (language === 'en' ? section.meta_title_en : section.meta_title_bn) || undefined,
        metaDescription: (language === 'en' ? section.meta_description_en : section.meta_description_bn) || undefined,
        raw: section,
      };
    }

    return {
      title: fallbacks?.title || '',
      content: fallbacks?.content || '',
    };
  };

  const getSectionText = (sectionKey: string, field: 'title' | 'content', fallback: string): string => {
    const section = sections?.find((s) => s.section_key === sectionKey);
    if (!section) return fallback;

    if (field === 'title') {
      return (language === 'en' ? section.title_en : section.title_bn) || fallback;
    }
    return (language === 'en' ? section.content_en : section.content_bn) || fallback;
  };

  const getMetaTitle = (fallback: string): string => {
    // Look for hero section first for meta info
    const heroSection = sections?.find((s) => s.section_key === 'hero');
    if (heroSection) {
      return (language === 'en' ? heroSection.meta_title_en : heroSection.meta_title_bn) || fallback;
    }
    return fallback;
  };

  const getMetaDescription = (fallback: string): string => {
    const heroSection = sections?.find((s) => s.section_key === 'hero');
    if (heroSection) {
      return (language === 'en' ? heroSection.meta_description_en : heroSection.meta_description_bn) || fallback;
    }
    return fallback;
  };

  return {
    sections,
    isLoading,
    error,
    getSection,
    getSectionText,
    getMetaTitle,
    getMetaDescription,
  };
};
