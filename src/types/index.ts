export interface Product {
  id: number;
  product_key: string;
  name: string;
  brand: string;
}

export interface FieldValue {
  value: string;
  confidence: number;
  state: 'sourced' | 'needs_review' | 'manual';
  source: string | null;
  sourceLabel: string | null;
}

export interface FieldMeta {
  label: string;
  group: string;
  wide?: boolean;
  infoIcon?: boolean;
}

export interface CategoryDef {
  key: string;
  name: string;
}

export interface CategoryStats {
  total: number;
  populated: number;
  review: number;
}

export interface Suggestion {
  value: string;
  confidence: number;
  label: string;
  tone: 'good' | 'warn' | 'bad';
}