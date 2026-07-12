import { Button } from '@/components/common/Button';
import { LightningIcon } from '@/components/common/Icons';
import { Suggestion } from '@/types';

interface Props {
  fieldKey: string | null;
  fieldLabel: string | null;
  suggestions: Suggestion[];
  onApply: (value: string) => void;
}

export const SmartSuggestionsPanel = ({ fieldKey, fieldLabel, suggestions, onApply }: Props) => {
  const top = suggestions.length > 0 ? suggestions[0] : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Suggestions Panel Header */}
      <div className="px-5 py-4 bg-[var(--forest-800)]">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <LightningIcon className="w-4 h-4 text-[var(--lime-400)]" />
          Smart Suggestions
        </div>
        <div className="text-[12px] text-white/70 mt-0.5 font-medium">
          for {fieldLabel ? <span>{fieldLabel}</span> : <span className="italic">Select a field needing review</span>}
        </div>
      </div>

      {/* Suggestions List */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {suggestions.length > 0 ? (
          suggestions.map((s, i) => {
            const toneStyle = {
              good: {
                card: 'border-emerald-500 bg-white hover:border-emerald-600',
                badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
                bar: 'bg-emerald-500',
                text: 'text-emerald-600'
              },
              warn: {
                card: 'border-gray-200 bg-white hover:border-amber-400',
                badge: 'bg-amber-50 text-amber-700 border border-amber-200/60',
                bar: 'bg-amber-500',
                text: 'text-amber-600'
              },
              bad:  {
                card: 'border-gray-200 bg-white hover:border-red-400',
                badge: 'bg-red-50 text-red-700 border border-red-200/60',
                bar: 'bg-red-500',
                text: 'text-red-600'
              },
            }[s.tone];
            return (
              <div
                key={i}
                onClick={() => onApply(s.value)}
                className={`rounded-lg border p-3.5 cursor-pointer hover:shadow-sm transition-all ${toneStyle.card}`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-bold text-gray-800 text-sm">{s.value}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${toneStyle.badge}`}>{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${toneStyle.bar} bar-grow`} style={{ width: `${s.confidence * 100}%` }} />
                  </div>
                  <span className={`text-xs font-bold w-9 text-right ${toneStyle.text}`}>{Math.round(s.confidence * 100)}%</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm">
            {fieldKey ? 'No suggestions available for this field.' : 'All fields in this category are resolved.'}
          </div>
        )}
      </div>

      {/* Apply Top Suggestion Button */}
      {top && (
        <div className="px-4 pb-4">
          <Button variant="primary" className="w-full justify-center py-2.5 font-bold shadow-sm" onClick={() => onApply(top.value)}>
            Apply '{top.value}' → field resolved
          </Button>
        </div>
      )}

      {/* Confidence Legend */}
      <div className="border-t border-gray-100 px-5 py-4">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Confidence</div>
        <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>High ≥ 90%</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/>Medium</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/>Low / blank</span>
        </div>
      </div>
    </div>
  );
};