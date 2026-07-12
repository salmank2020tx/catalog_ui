import { Button } from '@/components/common/Button';
import { CheckIcon, WarningCircleIcon } from '@/components/common/Icons';

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
    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-3.5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6 flex-wrap">
        {/* Left: Stacked Progress Bar info */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-bold text-gray-800">{populated} of {totalFields} fields auto-populated</span>
          <div className="w-[320px] h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-[var(--forest-600)] bar-grow" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-[11px] text-gray-400 italic font-medium mt-0.5">*Remaining fields are optional or pending source data</div>
        </div>

        {/* Center: Needs Review Warning */}
        <div className="flex-1 flex justify-center">
          {reviewCount > 0 ? (
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#e7a63c]">
              <WarningCircleIcon className="w-5 h-5" />
              {reviewCount} field{reviewCount !== 1 ? 's' : ''} need{reviewCount === 1 ? 's' : ''} review
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckIcon className="w-3.5 h-3.5" /> All fields resolved
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={onSaveDraft}>Save Draft</Button>
          <Button variant="primary" onClick={onPublish} disabled={!canPublish} loading={publishing}>
            {publishing ? 'Publishing…' : 'Publish Listing'}
          </Button>
        </div>
      </div>
    </div>
  );
};