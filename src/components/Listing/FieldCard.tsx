import { useState, useEffect } from 'react';
import { ConfidenceBadge } from '@/components/common/ConfidenceBadge';
import { ErrorCircleIcon, InfoCircleIcon } from '@/components/common/Icons';

interface Props {
  fieldKey: string;
  meta: { label: string; wide?: boolean; infoIcon?: boolean };
  data: { value: string; confidence: number; state: string; sourceLabel: string | null };
  onUpdate: (value: string) => void;
  onOpenSuggestions: () => void;
  active: boolean;
}

export const FieldCard = ({ fieldKey, meta, data, onUpdate, onOpenSuggestions, active }: Props) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.value || '');
  const needsReview = data.state === 'needs_review';

  useEffect(() => setDraft(data.value || ''), [data.value]);

  const commit = () => { onUpdate(draft); setEditing(false); };

  return (
    <div id={fieldKey} className={meta.wide ? 'sm:col-span-2' : ''}>
      <div className="text-[11px] font-bold tracking-wide text-gray-400 uppercase mb-1.5 flex items-center gap-1.5 select-none">
        <span>{meta.label}</span>
        {active && (
          <span className="inline-flex items-center gap-1 text-emerald-600 normal-case font-bold ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            selected
          </span>
        )}
      </div>
      <div className={`h-[52px] rounded-lg border flex items-center px-3.5 gap-2 transition-all ${
        needsReview
          ? 'border-[#dc4b4b] bg-[#fdf2f2]'
          : 'border-gray-200 bg-white hover:border-emerald-300'
      }`}>
        {editing ? (
          <>
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && commit()}
              className="flex-1 min-w-0 text-sm text-gray-900 outline-none border-b border-emerald-400 pb-0.5 bg-transparent"
            />
            <button onClick={commit} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 shrink-0">Save</button>
            <button onClick={() => { setEditing(false); setDraft(data.value || ''); }} className="text-xs text-gray-400 hover:text-gray-600 shrink-0">Cancel</button>
          </>
        ) : needsReview ? (
          <button onClick={onOpenSuggestions} className="flex-1 flex items-center justify-between text-left group min-w-0 h-full">
            <span className="flex items-center gap-2 text-sm font-semibold text-[#dc4b4b] min-w-0">
              <ErrorCircleIcon className="w-5 h-5 shrink-0" />
              <span className="truncate">Not found in source files — choose a suggestion</span>
            </span>
            <span className="text-[#dc4b4b] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2 font-bold text-sm">→</span>
          </button>
        ) : (
          <>
            <span
              className="flex-1 min-w-0 text-sm text-gray-800 truncate font-medium cursor-pointer"
              title={data.value}
              onClick={() => setEditing(true)}
            >
              {data.value}
            </span>
            {meta.infoIcon ? (
              <span className="text-emerald-600 shrink-0 cursor-help" title={`Source: ${data.sourceLabel || 'No source available'}`}>
                <InfoCircleIcon className="w-5 h-5" />
              </span>
            ) : (
              <ConfidenceBadge score={data.confidence} />
            )}
          </>
        )}
      </div>
    </div>
  );
};