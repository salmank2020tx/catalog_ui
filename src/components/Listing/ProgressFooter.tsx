import { Button } from '@/components/common/Button';
import { CheckIcon, AlertIcon } from '@/components/common/Icons';

interface Props {
  populated: number;
  reviewCount: number;
  onPublish: () => void;
  onSaveDraft: () => void;
  publishing: boolean;
  canPublish: boolean;
  totalFields: number;
}

export const ProgressFooter = ({ populated, reviewCount, onPublish, onSaveDraft, publishing, canPublish, totalFields }: Props) => {
  const pct = Math.round((populated / totalFields) * 100);
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">{populated} of {totalFields} fields auto-populated</span>
            <div className="w-32 sm:w-40 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-[var(--forest-600)] bar-grow" style={{ width: `${pct}%` }} />
            </div>
          </div>
          {reviewCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <AlertIcon className="w-3 h-3" /> {reviewCount} field{reviewCount !== 1 ? 's' : ''} need review
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckIcon className="w-3 h-3" /> All fields resolved
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onSaveDraft}>Save Draft</Button>
          <Button variant="primary" size="sm" onClick={onPublish} disabled={!canPublish} loading={publishing}>
            {publishing ? 'Publishing…' : 'Publish Listing'}
          </Button>
        </div>
      </div>
    </div>
  );
};