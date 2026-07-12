import apiClient from './client';
import type {
  Product,
  Listing,
  ListingGenerationRequest,
  ListingGenerationResponse,
  FieldUpdate,
} from '@/types';

export const productApi = {
  search: (query: string) =>
    apiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`),
  getProduct: (id: number) => apiClient.get<Product>(`/products/${id}`),
};

export const listingApi = {
  generate: (data: ListingGenerationRequest) =>
    apiClient.post<ListingGenerationResponse>('/listings/generate', data),
  getListing: (id: number) => apiClient.get<Listing>(`/listings/${id}`),
  updateField: (listingId: number, fieldId: number, value: string) =>
    apiClient.patch(`/listings/${listingId}/fields`, { fieldId, value }),
  publish: (listingId: number) =>
    apiClient.post(`/listings/${listingId}/publish`),
  getVersions: (listingId: number) =>
    apiClient.get(`/listings/${listingId}/versions`),
  exportExcel: (listingId: number) =>
    apiClient.get(`/listings/${listingId}/export`),
};