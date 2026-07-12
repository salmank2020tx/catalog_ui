import { CheckIcon, AlertIcon } from '@/components/common/Icons';

interface Category {
  key: string;
  name: string;
  total: number;
  populated: number;
  reviewCount: number;
}

interface Props {
  categories: Category[];
  activeCategory: string;
  onSelect: (key: string) => void;
}

export const Sidebar = ({ categories, activeCategory, onSelect }: Props) => (
  <aside>
    <div className="text-[11px] font-bold tracking-wide text-gray-400 uppercase mb-2 px-1">Categories</div>
    <div className="space-y-2">
      {categories.map(cat => {
        const isActive = cat.key === activeCategory;
        const isReview = cat.reviewCount > 0;
        return (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors border ${
              isActive ? 'bg-emerald-50 border-emerald-200' : isReview ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-transparent hover:bg-gray-50'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              isReview ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {isReview ? <AlertIcon className="w-3.5 h-3.5" /> : <CheckIcon className="w-3.5 h-3.5" />}
            </span>
            <span className="flex-1 min-w-0">
              <div className={`text-sm font-semibold truncate ${isActive ? 'text-emerald-900' : 'text-gray-700'}`}>{cat.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {isReview ? `${cat.total} · ${cat.reviewCount} review` : `${cat.populated} populated`}
              </div>
            </span>
          </button>
        );
      })}
    </div>
  </aside>
);