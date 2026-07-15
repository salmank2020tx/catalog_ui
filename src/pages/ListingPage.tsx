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

  // Support reading multiple product IDs
  const productIdsParam = searchParams.get('productIds') || searchParams.get('productId') || '';
  
  const productIds = useMemo(() => {
    return productIdsParam ? productIdsParam.split(',').filter(Boolean) : [];
  }, [productIdsParam]);

  const selectedProducts = useMemo(() => {
    return mockProducts.filter((p) => productIds.includes(p.id));
  }, [productIds]);

  const firstProduct = selectedProducts[0] || mockProducts[0];

  // If no products remain, navigate back to Search
  useEffect(() => {
    if (productIds.length === 0) {
      navigate('/');
    }
  }, [productIds, navigate]);

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
  const [query, setQuery] = useState(firstProduct?.name || '');
  const [debouncedQuery, setDebouncedQuery] = useState(firstProduct?.name || '');
  const [showResults, setShowResults] = useState(false);

  // Sync query when first product changes
  useEffect(() => {
    if (firstProduct) {
      setQuery(firstProduct.name);
      setDebouncedQuery(firstProduct.name);
    }
  }, [firstProduct]);

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
    // Navigate to single product edit view
    navigate(`/listing?productIds=${p.id}&template=${template}&market=${market}&language=${language}`);
    setQuery(p.name);
    setShowResults(false);
  };

  const handleRemoveProductFromBatch = (idToRemove: string) => {
    const remainingIds = productIds.filter(id => id !== idToRemove);
    if (remainingIds.length === 0) {
      navigate('/');
    } else {
      const params = new URLSearchParams(searchParams);
      params.set('productIds', remainingIds.join(','));
      navigate({ search: params.toString() }, { replace: true });
    }
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
    <div className="min-h-screen flex flex-col bg-[var(--paper)] font-sans">
      <Header
        query={query}
        onQueryChange={(val) => {
          setQuery(val);
          setShowResults(val.length >= 2);
        }}
        results={searchResults}
        showResults={showResults}
        onSelect={handleSearchSelect}
        onFocus={() => setShowResults(query.length >= 2)}
        onCloseResults={() => setShowResults(false)}
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
        <button onClick={handleBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1.5 font-semibold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
          Back to Search
        </button>
        <div className="text-right">
          <div className="text-xs text-gray-400 font-semibold">Draft · Auto-saved just now</div>
        </div>
      </div>

      {/* Product title with template/market/language selection chips */}
      <div className="max-w-[1400px] w-full mx-auto px-6 pb-3">
        {selectedProducts.length > 1 ? (
          <div className="mb-2">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Batch Editing Listing
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                {selectedProducts.length} Products Selected
              </span>
            </h1>
          </div>
        ) : (
          firstProduct && <h1 className="text-xl font-bold text-gray-900">{firstProduct.name}</h1>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {selectedProducts.map((p) => (
            <div
              key={p.id}
              className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs font-semibold select-none"
            >
              <span className="max-w-[180px] truncate" title={p.name}>{p.name}</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold shrink-0">({p.product_key})</span>
              {selectedProducts.length > 1 && (
                <button
                  onClick={() => handleRemoveProductFromBatch(p.id)}
                  className="text-emerald-600 hover:text-emerald-950 font-extrabold text-xs ml-1 focus:outline-none shrink-0"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          <div className="h-4 w-px bg-gray-300 mx-2 hidden sm:block" />
          
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 font-bold select-none">{template}</span>
          <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 font-bold select-none">{market}</span>
          <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200 font-bold select-none">{language}</span>
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
              <div className="mb-5 select-none">
                <h2 className="text-lg font-bold text-gray-900">{currentCat.name}</h2>
                <p className="text-sm text-gray-400 mt-0.5 font-semibold">
                  {currentCat.total} fields populated in this category
                  {currentCat.reviewCount > 0 && <span className="text-amber-600 font-bold"> · {currentCat.reviewCount} needs review</span>}
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
                <div className="text-sm text-gray-400 py-10 text-center italic">
                  Fields for this category aren't wired into the demo yet.
                </div>
              )}
            </div>

            {/* Global Source Pill Badge at the bottom of the details card */}
            {activeField && fieldValues[activeField]?.sourceLabel && (
              <div className="mt-6 pt-4 border-t border-gray-50 flex">
                <div className="inline-flex items-center gap-2 bg-[var(--forest-800)] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm select-none">
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
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xl anim-in z-50">
          {toast}
        </div>
      )}
    </div>
  );
};