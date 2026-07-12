import { listingApi } from '@/api/endpoints';
import type {
  Listing,
  ListingGenerationRequest,
  ListingGenerationResponse,
  FieldValue,
} from '@/types';

export const listingService = {
  generateListing: async (
    data: ListingGenerationRequest
  ): Promise<ListingGenerationResponse> => {
    const response = await listingApi.generate(data);
    return response.data;
  },

  getListing: async (id: number): Promise<Listing> => {
    const response = await listingApi.getListing(id);
    return response.data;
  },

  updateField: async (
    listingId: number,
    fieldId: number,
    value: string
  ): Promise<void> => {
    await listingApi.updateField(listingId, fieldId, value);
  },

  publishListing: async (listingId: number): Promise<void> => {
    await listingApi.publish(listingId);
  },

  exportExcel: async (listingId: number): Promise<string> => {
    const response = await listingApi.exportExcel(listingId);
    return response.data.url;
  },
};