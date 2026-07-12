import { useState, useCallback } from 'react';
import { listingService } from '@/services/listingService';
import type { Listing, FieldValue } from '@/types';

export const useListing = () => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (productId: number, templateVersionId: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await listingService.generateListing({
        product_id: productId,
        template_version_id: templateVersionId,
      });
      // Fetch full listing after generation
      const fullListing = await listingService.getListing(result.listing_id);
      setListing(fullListing);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to generate listing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateField = useCallback(async (fieldId: number, value: string) => {
    if (!listing) return;
    try {
      await listingService.updateField(listing.id, fieldId, value);
      // Optimistically update local state
      setListing((prev) => {
        if (!prev) return prev;
        // Deep clone and update field value
        const updated = { ...prev };
        // In real implementation, you'd update the field in the nested structure
        return updated;
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update field');
      throw err;
    }
  }, [listing]);

  const publish = useCallback(async () => {
    if (!listing) return;
    try {
      await listingService.publishListing(listing.id);
      setListing((prev) => prev ? { ...prev, status: 'published' } : null);
    } catch (err: any) {
      setError(err.message || 'Failed to publish listing');
      throw err;
    }
  }, [listing]);

  return { listing, loading, error, generate, updateField, publish };
};