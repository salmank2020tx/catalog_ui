import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { ProgressFooter } from '@/components/Layout/ProgressFooter';
import { Sidebar } from '@/components/Listing/Sidebar';
import { FieldCard } from '@/components/Listing/FieldCard';
import { SmartSuggestionsPanel } from '@/components/Listing/SmartSuggestionsPanel';
import { TemplateSelector } from '@/components/common/TemplateSelector';
import { LinkIcon } from '@/components/common/Icons';
import { mockProducts, FIELD_META, initialFieldValues, CATEGORY_DEFS, CATEGORY_STATS, SUGGESTIONS, TOTAL_FIELDS_IN_TEMPLATE, FOOTER_BASELINE_POPULATED } from '@/data/mockData';
import { useProductsQuery } from '@/hooks/useProductsQuery';
import type { Product } from '@/types';

export const ListingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('productId') || '';
  const product = mockProducts.find(p => p.id === productId) || mockProducts[0];

  // Read template selections from URL (or default)
  const [template, setTemplate] = useState(searchParams.get('template') || 'Amazon');
  const [market, setMarket] = useState(searchParams.get('market') || 'UK');
  const [language, setLanguage] = useState(searchParams.get('language') || 'English');

  const [fieldValues, setFieldValues] = useState(initialFieldValues);
  const [activeCategory, setActiveCategory] = useState('product_details');
  const [activeField, setActiveField] = useState<string>('viscosity_grade');
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Search state for header - initialized with the product name
  const [query, setQuery] = useState(product.name);
  const [debouncedQuery, setDebouncedQuery] = useState(product.name);
  const [showResults, setShowResults] = useState(false);

  // Sync query when product changes
  useEffect(() => {
    setQuery(product.name);
    setDebouncedQuery(product.name);
  }, [product]);

  // Debounce the query to prevent aggressive API calling
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(handler);
  }, [query]);

  // Load search results using the API
  const { data: searchProducts = [] } = useProductsQuery(
    debouncedQuery.length >= 2 ? debouncedQuery : undefined
  );

  const categories = useMemo(() => {
    return CATEGORY_DEFS.map(cat => {
      const fieldsInCat = Object.entries(FIELD_META).filter(([, m]) => m.group === cat.key);
      const stats = CATEGORY_STATS[cat.key] || { total: fieldsInCat.length, populated: fieldsInCat.length, review: 0 };
      const reviewCount = fieldsInCat.filter(([k]) => fieldValues[k]?.state === 'needs_review').length;
      const resolvedDelta = stats.review - reviewCount;
      return {
        ...cat,
        total: stats.total,
        populated: stats.populated + resolvedDelta,
        reviewCount,
        fieldKeys: fieldsInCat.map(([k]) => k),
      };
    });
  }, [fieldValues]);

  const currentCat = categories.find(c => c.key === activeCategory)!;
  const totalReview = Object.values(fieldValues).filter(f => f.state === 'needs_review').length;
  const baselineReview = Object.values(initialFieldValues).filter(f => f.state === 'needs_review').length;
  const totalPopulated = FOOTER_BASELINE_POPULATED + (baselineReview - totalReview);

  const handleFieldUpdate = (key: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [key]: { ...prev[key], value, confidence: 0.99, state: 'manual', source: null, sourceLabel: 'Manually edited' },
    }));
  };

  const handleApplySuggestion = (value: string) => {
    if (!activeField) return;
    const confidence = SUGGESTIONS[activeField]?.find(s => s.value === value)?.confidence ?? 0.96;
    setFieldValues(prev => ({
      ...prev,
      [activeField]: { ...prev[activeField], value, confidence, state: 'sourced', source: 'derived', sourceLabel: 'AI Smart Suggestion' },
    }));
  };

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setToast('Listing published successfully!');
      setTimeout(() => setToast(null), 2500);
    }, 1200);
  };

  const handleSaveDraft = () => {
    setToast('Draft saved.');
    setTimeout(() => setToast(null), 2000);
  };

  const searchResults = useMemo(() => {
    if (query.length < 2) return [];
    return searchProducts;
  }, [query, searchProducts]);

  const handleSearchSelect = (p: Product) => {
    navigate(`/listing?productId=${p.id}&template=${template}&market=${market}&language=${language}`);
    setQuery(p.name);
    setShowResults(false);
  };

  const handleBack = () => navigate('/');

  const activeSuggestions = (activeField && fieldValues[activeField]?.state === 'needs_review')
    ? SUGGESTIONS[activeField] || []
    : [];

  // Handler for template changes – update URL params
  const handleTemplateChange = (t: string, m: string, l: string) => {
    setTemplate(t);
    setMarket(m);
    setLanguage(l);
    const params = new URLSearchParams(searchParams);
    params.set('template', t);
    params.set('market', m);
    params.set('language', l);
    navigate({ search: params.toString() }, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)]">
      <Header
        query={query}
        onQueryChange={setQuery}
        results={searchResults}
        showResults={showResults}
        onSelect={handleSearchSelect}
        onFocus={() => setShowResults(query.length >= 2)}
      />

      {/* Template Selector dropdowns */}
      <TemplateSelector
        initialTemplate={template}
        initialMarket={market}
        initialLanguage={language}
        onTemplateChange={handleTemplateChange}
      />

      {/* Back button and Draft state */}
      <div className="max-w-[1400px] w-full mx-auto px-6 pt-4 pb-2 flex items-center justify-between">
        <button onClick={handleBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1.5 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Back to Search
        </button>
        <div className="text-right">
          <div className="text-xs text-gray-400">Draft · Auto-saved just now</div>
        </div>
      </div>

      {/* Product title with template/market/language selection chips */}
      <div className="max-w-[1400px] w-full mx-auto px-6 pb-3">
        <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <p className="text-sm text-gray-400">SKU: <span className="font-mono">{product.product_key}</span> · Brand: {product.brand}</p>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">{template}</span>
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-medium">{market}</span>
          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200 font-medium">{language}</span>
        </div>
      </div>

      {/* Grid columns */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-5 pb-6">
        {/* Col 1: Sidebar */}
        <Sidebar categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />

        {/* Col 2: Main Details Form */}
        <main className="h-full">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between h-full">
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">{currentCat.name}</h2>
                <p className="text-sm text-gray-400 mt-0.5 font-medium">
                  {currentCat.total} fields populated in this category
                  {currentCat.reviewCount > 0 && <span className="text-amber-600 font-semibold"> · {currentCat.reviewCount} needs review</span>}
                </p>
              </div>
              {currentCat.fieldKeys.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentCat.fieldKeys.map(key => (
                    <FieldCard
                      key={key}
                      fieldKey={key}
                      meta={FIELD_META[key]}
                      data={fieldValues[key]}
                      onUpdate={(val) => handleFieldUpdate(key, val)}
                      onOpenSuggestions={() => setActiveField(key)}
                      active={key === activeField}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-400 py-10 text-center">
                  Fields for this category aren't wired into the demo yet.
                </div>
              )}
            </div>

            {/* Global Source Pill Badge at the bottom of the details card */}
            {activeField && fieldValues[activeField]?.sourceLabel && (
              <div className="mt-6 pt-4 border-t border-gray-50 flex">
                <div className="inline-flex items-center gap-2 bg-[var(--forest-800)] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm select-none">
                  <LinkIcon className="w-3.5 h-3.5 text-[var(--lime-400)] shrink-0" />
                  <span>Source: {fieldValues[activeField].sourceLabel}</span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Col 3: Suggestions Panel */}
        <aside className="h-full">
          <SmartSuggestionsPanel
            fieldKey={fieldValues[activeField]?.state === 'needs_review' ? activeField : null}
            fieldLabel={FIELD_META[activeField]?.label || null}
            suggestions={activeSuggestions}
            onApply={handleApplySuggestion}
          />
        </aside>
      </div>

      <ProgressFooter
        populated={totalPopulated}
        reviewCount={totalReview}
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
        publishing={publishing}
        canPublish={totalReview === 0}
        totalFields={TOTAL_FIELDS_IN_TEMPLATE}
      />

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl anim-in z-50">
          {toast}
        </div>
      )}
    </div>
  );
};