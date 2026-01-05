import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BusinessInfo {
  id: string;
  key: string;
  value_en: string | null;
  value_bn: string | null;
  metadata: Record<string, unknown>;
  updated_at: string;
}

export const useBusinessInfo = () => {
  return useQuery({
    queryKey: ['business-info'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('business_info') as any)
        .select('*')
        .order('key');

      if (error) throw error;
      return data as BusinessInfo[];
    },
  });
};

export const useBusinessInfoByKey = (key: string) => {
  const { data: allInfo, isLoading, error } = useBusinessInfo();
  const info = allInfo?.find((item) => item.key === key);
  return { data: info, isLoading, error };
};

export const useBusinessInfoMap = () => {
  const { data: allInfo, isLoading, error } = useBusinessInfo();
  
  const infoMap = allInfo?.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {} as Record<string, BusinessInfo>) ?? {};

  return { data: infoMap, isLoading, error };
};

export const useUpdateBusinessInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      value_en,
      value_bn,
      metadata,
    }: {
      key: string;
      value_en?: string;
      value_bn?: string;
      metadata?: Record<string, unknown>;
    }) => {
      const updateData: Record<string, unknown> = {};
      if (value_en !== undefined) updateData.value_en = value_en;
      if (value_bn !== undefined) updateData.value_bn = value_bn;
      if (metadata !== undefined) updateData.metadata = metadata;

      const { data, error } = await (supabase
        .from('business_info') as any)
        .update(updateData)
        .eq('key', key)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-info'] });
    },
  });
};

export const useCreateBusinessInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      value_en,
      value_bn,
      metadata,
    }: {
      key: string;
      value_en?: string;
      value_bn?: string;
      metadata?: Record<string, unknown>;
    }) => {
      const insertData = {
        key,
        value_en: value_en ?? '',
        value_bn: value_bn ?? '',
        metadata: metadata ?? {},
      };
      const { data, error } = await (supabase
        .from('business_info') as any)
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-info'] });
    },
  });
};
