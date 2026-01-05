import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PageContent {
  id: string;
  page_slug: string;
  section_key: string;
  title_en: string | null;
  title_bn: string | null;
  content_en: string | null;
  content_bn: string | null;
  meta_title_en: string | null;
  meta_title_bn: string | null;
  meta_description_en: string | null;
  meta_description_bn: string | null;
  display_order: number;
  is_active: boolean;
  updated_at: string;
}

export const usePageContent = (pageSlug?: string) => {
  return useQuery({
    queryKey: ['page-content', pageSlug],
    queryFn: async () => {
      let query = (supabase.from('page_content') as any)
        .select('*')
        .order('display_order');

      if (pageSlug) {
        query = query.eq('page_slug', pageSlug);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PageContent[];
    },
  });
};

export const usePageSection = (pageSlug: string, sectionKey: string) => {
  const { data: allContent, isLoading, error } = usePageContent(pageSlug);
  const section = allContent?.find((item) => item.section_key === sectionKey);
  return { data: section, isLoading, error };
};

export const useAllPageContent = () => {
  return useQuery({
    queryKey: ['page-content-all'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('page_content') as any)
        .select('*')
        .order('page_slug')
        .order('display_order');

      if (error) throw error;
      return data as PageContent[];
    },
  });
};

export const useUpdatePageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<PageContent> & { id: string }) => {
      const { data, error } = await (supabase.from('page_content') as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content-all'] });
    },
  });
};

export const useCreatePageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: Omit<PageContent, 'id' | 'updated_at'>) => {
      const { data, error } = await (supabase.from('page_content') as any)
        .insert(content)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content-all'] });
    },
  });
};

export const useDeletePageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from('page_content') as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content-all'] });
    },
  });
};
