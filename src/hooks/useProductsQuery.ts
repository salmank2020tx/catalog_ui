import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/endpoints';
import type { Product } from '@/types';

export const useProductsQuery = (search?: string) => {
  return useQuery<Product[]>({
    queryKey: ['products', search],
    queryFn: async () => {
      const response = await productApi.list(search ? { q: search } : undefined);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
