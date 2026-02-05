import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string | null;
  short_description_en: string | null;
  short_description_bn: string | null;
  description_en: string | null;
  description_bn: string | null;
  status: string;
  features: { title?: string; description?: string }[] | null;
  highlights: string[] | null;
  media: { type?: string; url?: string }[] | null;
  display_order: number | null;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['public-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['public-product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!slug,
  });
};