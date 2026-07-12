import { CheckIcon, ExclamationIcon } from '@/components/common/Icons';

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
  <aside className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 w-full h-full flex flex-col">
    <div className="text-[11px] font-serif font-extrabold tracking-wider text-[var(--forest-600)] uppercase mb-4 px-1 select-none">
      CATEGORIES
    </div>
    <div className="space-y-2">
      {categories.map(cat => {
        const isActive = cat.key === activeCategory;
        const isReview = cat.reviewCount > 0;
        return (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center gap-3 transition-all border ${
              isActive
                ? 'bg-emerald-50/50 border-emerald-500/20 shadow-sm'
                : 'bg-transparent border-transparent hover:bg-gray-50'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              isReview ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {isReview ? <ExclamationIcon className="w-3.5 h-3.5" /> : <CheckIcon className="w-3.5 h-3.5" />}
            </span>
            <span className="flex-1 min-w-0">
              <div className={`text-sm font-serif font-bold truncate ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>{cat.name}</div>
              <div className={`text-xs mt-0.5 ${isReview ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}>
                {isReview ? `${cat.total} · ${cat.reviewCount} review` : `${cat.populated} populated`}
              </div>
            </span>
          </button>
        );
      })}
    </div>
  </aside>
);