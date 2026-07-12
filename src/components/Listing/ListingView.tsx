import { useState } from 'react';
import { CategorySection } from './CategorySection';
import { ProgressFooter } from './ProgressFooter';
import { SmartSuggestions } from './SmartSuggestions';
import type { Listing, CategoryGroup } from '@/types';
import { Spinner } from '@/components/common/Spinner';

interface ListingViewProps {
  listing: Listing;
  groups: CategoryGroup[];
  onFieldUpdate: (fieldId: number, value: string) => void;
  onPublish: () => void;
  publishing: boolean;
  loading?: boolean;
}

export const ListingView = ({
  listing,
  groups,
  onFieldUpdate,
  onPublish,
  publishing,
  loading,
}: ListingViewProps) => {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeField, setActiveField] = useState<number | null>(null);

  const suggestionsMap: Record<number, { value: string; confidence: number; source?: string }[]> = {
    10: [
      { value: '5W-30', confidence: 0.96, source: 'PDS' },
      { value: '5W-40', confidence: 0.38, source: 'Alternative' },
      { value: '0W-30', confidence: 0.19, source: 'Unlikely' },
    ],
    18: [
      { value: 'ISO 9001', confidence: 0.92, source: 'MSDS' },
      { value: 'API CJ-4', confidence: 0.85, source: 'MSDS' },
    ],
  };

  const handleShow = (fieldId: number) => {
    setActiveField(fieldId);
    setSuggestionsOpen(true);
  };

  const handleSelect = (value: string) => {
    if (activeField !== null) {
      onFieldUpdate(activeField, value);
    }
    setSuggestionsOpen(false);
    setActiveField(null);
  };

  const totalFields = groups.reduce((acc, g) => acc + g.total, 0);
  const populatedFields = groups.reduce((acc, g) => acc + g.populated, 0);
  const needsReview = groups.reduce(
    (acc, g) =>
      acc +
      g.fields.filter(
        (f) => f.state === 'needs_review' || (f.confidence_score ?? 0) < 0.7
      ).length,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-28">
      <div className="mb-6 mt-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
          {listing.product?.name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">SKU: {listing.product?.product_key}</p>
      </div>

      <div className="space-y-4">
        {groups.map((group, idx) => (
          <CategorySection
            key={idx}
            category={group}
            onFieldUpdate={onFieldUpdate}
            onShowSuggestions={handleShow}
            suggestionsMap={{
              [activeField || 0]: suggestionsMap[activeField || 0]?.map((s) => s.value) || [],
            }}
          />
        ))}
      </div>

      <SmartSuggestions
        isOpen={suggestionsOpen}
        onClose={() => setSuggestionsOpen(false)}
        onSelect={handleSelect}
        suggestions={activeField ? suggestionsMap[activeField] || [] : []}
        fieldName={
          activeField
            ? groups
                .flatMap((g) => g.fields)
                .find((f) => f.catalog_field_id === activeField)?.field_name || `Field ${activeField}`
            : ''
        }
      />

      <ProgressFooter
        total={totalFields}
        populated={populatedFields}
        needsReview={needsReview}
        onPublish={onPublish}
        publishing={publishing}
        canPublish={needsReview === 0}
      />
    </div>
  );
};