import { useState } from 'react';
import { ConfidenceBadge } from '@/components/common/ConfidenceBadge';
import { Button } from '@/components/common/Button';
import type { FieldValue } from '@/types';
import { cn } from '@/utils/helpers';

interface FieldItemProps {
  field: FieldValue;
  onUpdate: (value: string) => void;
  onShowSuggestions?: () => void;
  suggestions?: string[];
}

// Source icon mapping
const sourceIcons: Record<string, string> = {
  fusion: '🏢',
  smarchy: '📊',
  pds: '📄',
  msds: '🛡️',
  image: '🖼️',
  derived: '🧠',
};

export const FieldItem = ({
  field,
  onUpdate,
  onShowSuggestions,
  suggestions = [],
}: FieldItemProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(field.value_text || '');
  const isLow = field.confidence_score !== undefined && field.confidence_score < 0.7;
  const isCarried = field.state === 'carried';
  const fieldName = field.field_name || `Field ${field.catalog_field_id}`;

  const handleSave = () => {
    onUpdate(value);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setEditing(false);
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-all',
        isLow ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white',
        isCarried && 'border-amber-200 bg-amber-50'
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">{fieldName}</span>
            {field.source_type && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                {sourceIcons[field.source_type] || '📎'} {field.source_type}
              </span>
            )}
            {isCarried && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Carried from v{field.carried_from_version}
              </span>
            )}
          </div>

          {editing ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-[120px] px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                autoFocus
              />
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-gray-900 break-words">
                {field.value_text || (
                  <span className="text-gray-400 italic">Not populated</span>
                )}
              </span>
              {isLow && suggestions.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onShowSuggestions}
                  className="text-xs"
                >
                  Suggestions
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setValue(field.value_text || '');
                  setEditing(true);
                }}
                className="text-xs"
              >
                Edit
              </Button>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 self-start sm:self-center">
          <ConfidenceBadge score={field.confidence_score} />
        </div>
      </div>
      {field.snippet && (
        <div className="mt-2 text-xs text-gray-500 border-t border-gray-100 pt-2">
          Source snippet: {field.snippet}
        </div>
      )}
    </div>
  );
};