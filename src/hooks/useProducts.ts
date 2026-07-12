import { useState, useCallback } from 'react';
import { Product } from '@/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    // Mock – you can replace with API call later
    setProducts([
      { id: 1, product_key: 'CAS-EDG-5W30-5Q', name: 'Castrol EDGE 5W-30 Advanced Full Synthetic Motor Oil, 5 Quarts', brand: 'Castrol', created_at: '', updated_at: '' },
    ]);
  }, []);

  return { products, loading, error, search };
};