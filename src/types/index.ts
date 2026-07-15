export interface Product {
  id: string;
  product_key: string;
  name: string;
  brand?: string | null;
  product_family?: string | null;
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

export interface Listing {
  id: number;
  status: string;
  [key: string]: any;
}

export interface ListingGenerationRequest {
  product_id: string | number;
  template_version_id: number;
}

export interface ListingGenerationResponse {
  listing_id: number;
}

export interface FieldUpdate {
  fieldId: number;
  value: string;
}