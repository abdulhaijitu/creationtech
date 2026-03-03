import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type PageContent = Tables<'page_content'>;

export const usePageContent = (pageSlug?: string) => {
  return useQuery({
    queryKey: ['page-content', pageSlug],
    queryFn: async () => {
      let query = supabase
        .from('page_content')
        .select('*')
        .order('display_order');

      if (pageSlug) {
        query = query.eq('page_slug', pageSlug);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_slug')
        .order('display_order');

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdatePageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: TablesUpdate<'page_content'> & { id: string }) => {
      const { data, error } = await supabase
        .from('page_content')
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
    mutationFn: async (content: TablesInsert<'page_content'>) => {
      const { data, error } = await supabase
        .from('page_content')
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
      const { error } = await supabase
        .from('page_content')
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
