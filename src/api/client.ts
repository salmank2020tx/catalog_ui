import axios from 'axios';
import { mockProducts } from '@/data/mockData';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add auth token if present
apiClient.interceptors.request.use((config) => {
  // Mock products API call using custom adapter
  if (config.url && (config.url.startsWith('/products/') || config.url.startsWith('/products'))) {
    config.adapter = async (cfg) => {
      const params = cfg.params || {};
      const queryVal = (params.q || params.search || '').trim().toLowerCase();
      
      let filtered = [...mockProducts];
      
      console.log(
        `%c[Mock API] GET ${cfg.baseURL || ''}${cfg.url}`, 
        'color: #10b981; font-weight: bold; padding: 2px 4px; border-radius: 3px; background: #ecfdf5;', 
        { params, response: filtered }
      );

      if (queryVal) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(queryVal) || 
          p.product_key.toLowerCase().includes(queryVal) ||
          (p.brand && p.brand.toLowerCase().includes(queryVal)) ||
          (p.product_family && p.product_family.toLowerCase().includes(queryVal))
        );
      }
      
      // Simulate real-world network latency (300ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        data: filtered,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: cfg,
      } as any;
    };
  }

  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;