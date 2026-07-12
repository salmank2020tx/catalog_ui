import { useState } from 'react';
import { FieldItem } from './FieldItem';
import type { CategoryGroup } from '@/types';
import { cn } from '@/utils/helpers';

interface CategorySectionProps {
  category: CategoryGroup;
  onFieldUpdate: (fieldId: number, value: string) => void;
  onShowSuggestions: (fieldId: number) => void;
  suggestionsMap?: Record<number, string[]>;
}

export const CategorySection = ({
  category,
  onFieldUpdate,
  onShowSuggestions,
  suggestionsMap = {},
}: CategorySectionProps) => {
  const [expanded, setExpanded] = useState(true);
  const needsReview = category.fields.some(
    (f) => f.state === 'needs_review' || (f.confidence_score ?? 0) < 0.7
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-800">{category.name}</span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {category.populated}/{category.total} populated
          </span>
          {needsReview && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Needs review
            </span>
          )}
        </div>
        <svg
          className={cn('w-5 h-5 text-gray-400 transition-transform duration-200', expanded && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {category.fields.map((f, idx) => (
            <FieldItem
              key={idx}
              field={f}
              onUpdate={(val) => onFieldUpdate(f.catalog_field_id, val)}
              onShowSuggestions={() => onShowSuggestions(f.catalog_field_id)}
              suggestions={suggestionsMap[f.catalog_field_id] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
};