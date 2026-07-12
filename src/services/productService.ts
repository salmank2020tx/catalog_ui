import { productApi } from '@/api/endpoints';
import type { Product } from '@/types';

export const productService = {
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await productApi.search(query);
    return response.data;
  },
};