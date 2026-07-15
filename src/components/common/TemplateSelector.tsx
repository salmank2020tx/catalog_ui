import { useState, useRef, useEffect } from 'react';

interface TemplateSelectorProps {
  onTemplateChange?: (template: string, market: string, language: string) => void;
  initialTemplate?: string;
  initialMarket?: string;
  initialLanguage?: string;
}

const MASTER_TEMPLATES = ['Amazon', 'Flipkart', 'Walmart', 'eBay', 'Target', 'Best Buy', 'Alibaba', 'Rakuten'];
const MARKET_SEGMENTS = ['UK', 'Germany', 'France', 'US', 'India', 'Australia', 'Japan', 'China', 'Brazil', 'Mexico'];

const LANGUAGES = [
  'English', 'German', 'French', 'Spanish', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Chinese', 'Japanese',
  'Korean', 'Arabic', 'Hindi', 'Bengali', 'Punjabi', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati',
  'Polish', 'Ukrainian', 'Romanian', 'Greek', 'Czech', 'Swedish', 'Hungarian', 'Catalan', 'Serbian', 'Croatian',
  'Bulgarian', 'Slovak', 'Danish', 'Finnish', 'Norwegian', 'Hebrew', 'Malay', 'Indonesian', 'Thai', 'Vietnamese',
  'Burmese', 'Sinhala', 'Nepali', 'Mongolian', 'Kazakh', 'Uzbek', 'Azerbaijani', 'Georgian', 'Armenian', 'Albanian',
  'Bosnian', 'Macedonian', 'Slovenian', 'Latvian', 'Lithuanian', 'Estonian', 'Icelandic', 'Maltese', 'Irish',
  'Welsh', 'Gaelic', 'Yiddish', 'Luxembourgish', 'Frisian', 'Kurdish', 'Pashto', 'Dari', 'Tajik', 'Turkmen',
  'Kyrgyz', 'Bashkir', 'Tatar', 'Chuvash', 'Mari', 'Udmurt', 'Komi', 'Kalmyk', 'Buryat', 'Yakut',
  'Tuvin', 'Altai', 'Khakas', 'Shor', 'Evenki', 'Nenets', 'Chukchi', 'Koryak', 'Itelmen', 'Aleut',
  'Inuktitut', 'Greenlandic', 'Sami', 'Vepsian', 'Karelian', 'Moksha', 'Erzya', 'Komi-Permyak',
  'Abkhaz', 'Ossetian', 'Chechen', 'Ingush', 'Avar', 'Lezgin', 'Lak', 'Dargwa', 'Tabasaran', 'Rutul'
];

interface CustomSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  searchable?: boolean;
  widthClass?: string;
}

const CustomSelect = ({ label, options, value, onChange, searchable = false, widthClass = 'w-40' }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex items-center gap-2.5" ref={ref}>
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider select-none">{label}:</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between text-sm font-semibold border border-gray-300 rounded-lg px-3.5 py-1.5 ${widthClass} bg-white hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 transition-all text-left text-gray-800 shadow-sm`}
        >
          <span className="truncate">{value}</span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ml-1.5 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {isOpen && (
          <div className={`absolute left-0 z-50 mt-1.5 ${widthClass} bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto anim-in`}>
            {searchable && (
              <div className="sticky top-0 bg-white p-1.5 border-b border-gray-100 z-10">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-md px-2.5 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50/50"
                  autoFocus
                />
              </div>
            )}
            <div className="py-1">
              {filtered.length > 0 ? (
                filtered.map(opt => {
                  const isSelected = opt === value;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onChange(opt);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })
              ) : (
                <div className="px-3.5 py-2 text-xs text-gray-400 italic">No results</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TemplateSelector = ({
  onTemplateChange,
  initialTemplate = 'Amazon',
  initialMarket = 'UK',
  initialLanguage = 'English',
}: TemplateSelectorProps) => {
  const [template, setTemplate] = useState(initialTemplate);
  const [market, setMarket] = useState(initialMarket);
  const [language, setLanguage] = useState(initialLanguage);

  const handleChange = (field: 'template' | 'market' | 'language', value: string) => {
    let newTemplate = template;
    let newMarket = market;
    let newLanguage = language;

    if (field === 'template') { setTemplate(value); newTemplate = value; }
    if (field === 'market') { setMarket(value); newMarket = value; }
    if (field === 'language') { setLanguage(value); newLanguage = value; }

    if (onTemplateChange) {
      onTemplateChange(newTemplate, newMarket, newLanguage);
    }
  };

  return (
    <div className="relative z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm select-none">
      <div className="max-w-[1400px] w-full mx-auto px-6 py-2.5 flex flex-wrap items-center gap-6">
        <CustomSelect
          label="Template"
          options={MASTER_TEMPLATES}
          value={template}
          onChange={(val) => handleChange('template', val)}
          searchable
          widthClass="w-44"
        />
        <CustomSelect
          label="Market"
          options={MARKET_SEGMENTS}
          value={market}
          onChange={(val) => handleChange('market', val)}
          widthClass="w-36"
        />
        <CustomSelect
          label="Language"
          options={LANGUAGES}
          value={language}
          onChange={(val) => handleChange('language', val)}
          searchable
          widthClass="w-44"
        />

        <div className="text-xs text-gray-400 font-semibold ml-auto hidden sm:block">
          {template} · {market} · {language}
        </div>
      </div>
    </div>
  );
};