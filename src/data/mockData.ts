import { Product, FieldValue, FieldMeta, CategoryDef, CategoryStats, Suggestion } from '@/types';

export const mockProducts: Product[] = [
  { id: 'c5308c4d-b6c8-47fb-8671-bc01db5452f4', name: 'Castrol EDGE 5W-30 Advanced Full Synthetic Motor Oil, 5 Quarts', product_key: 'CAS-EDG-5W30-5Q', brand: 'Castrol', product_family: 'EDGE' },
  { id: 'a1208c4d-b6c8-47fb-8671-bc01db5452f5', name: 'Castrol GTX 15W-40 Diesel Engine Oil, 5L', product_key: 'CAS-GTX-15W40-5L', brand: 'Castrol', product_family: 'GTX' },
  { id: 'b3408c4d-b6c8-47fb-8671-bc01db5452f6', name: 'Castrol MAGNATEC 5W-30 C3 Full Synthetic', product_key: 'CAS-MAG-5W30-C3', brand: 'Castrol', product_family: 'MAGNATEC' },
  { id: 'd5608c4d-b6c8-47fb-8671-bc01db5452f7', name: 'Castrol GTX HIGH MILEAGE 10W-40, 5 Quarts', product_key: 'CAS-GTX-HM-10W40-5Q', brand: 'Castrol', product_family: 'GTX' },
  { id: 'e9638c4d-b6c8-47fb-8671-bc01db5452f3', name: 'Shell Gadus S2 V220 2', product_key: 'SKU-99081', brand: 'Shell', product_family: 'Gadus' },
];

export const FIELD_META: Record<string, FieldMeta> = {
  item_name:      { label: 'Item Name',      group: 'product_details', wide: true },
  brand_name:     { label: 'Brand Name',     group: 'product_details' },
  pack_size:      { label: 'Pack Size',      group: 'product_details' },
  sku:            { label: 'SKU',            group: 'product_details' },
  material_type:  { label: 'Material Type',  group: 'product_details' },
  viscosity_grade:{ label: 'Viscosity Grade',group: 'product_details', wide: true },
  application:    { label: 'Application',    group: 'product_details', infoIcon: true },
  acea_spec:      { label: 'ACEA Spec',      group: 'product_details' },
  supplier_name:  { label: 'Supplier Name',  group: 'supplier_description', wide: true },
  supplier_id:    { label: 'Supplier ID',    group: 'supplier_description' },
  offer_price:    { label: 'List Price',     group: 'offer' },
  offer_currency: { label: 'Currency',       group: 'offer' },
  offer_moq:      { label: 'Minimum Order Qty', group: 'offer' },
  flash_point:    { label: 'Flash Point',    group: 'safety_compliance' },
  hazard_class:   { label: 'Hazard Class',   group: 'safety_compliance' },
};

export const initialFieldValues: Record<string, FieldValue> = {
  item_name:       { value: 'Castrol EDGE 5W-30 Advanced Full Synthetic Motor Oil', confidence: 0.99, state: 'sourced', source: 'fusion', sourceLabel: 'Fusion — Product Master' },
  brand_name:       { value: 'Castrol', confidence: 0.98, state: 'sourced', source: 'fusion', sourceLabel: 'Fusion — Product Master' },
  pack_size:        { value: '5 Quarts', confidence: 0.97, state: 'sourced', source: 'fusion', sourceLabel: 'Fusion — Product Master' },
  sku:              { value: 'CAS-EDG-5W30-5Q', confidence: 0.95, state: 'sourced', source: 'fusion', sourceLabel: 'Fusion — Product Master' },
  material_type:    { value: 'Engine Oil', confidence: 0.88, state: 'sourced', source: 'pds', sourceLabel: 'PDS — Product Data Sheet (p.1)' },
  viscosity_grade:  { value: '', confidence: 0, state: 'needs_review', source: 'pds', sourceLabel: 'PDS — Product Data Sheet (p.2)' },
  application:      { value: 'Passenger car diesel', confidence: 0.96, state: 'sourced', source: 'pds', sourceLabel: 'PDS — Product Data Sheet (p.2)' },
  acea_spec:        { value: 'C2', confidence: 0.96, state: 'sourced', source: 'pds', sourceLabel: 'PDS — Product Data Sheet (p.2)' },
  supplier_name:    { value: 'Castrol Ltd.', confidence: 0.97, state: 'sourced', source: 'smarchy', sourceLabel: 'Smarchy — Supplier Registry' },
  supplier_id:      { value: 'SUP-00214', confidence: 0.94, state: 'sourced', source: 'smarchy', sourceLabel: 'Smarchy — Supplier Registry' },
  offer_price:      { value: '38.99', confidence: 0.92, state: 'sourced', source: 'fusion', sourceLabel: 'Fusion — Pricing' },
  offer_currency:   { value: 'USD', confidence: 0.99, state: 'sourced', source: 'fusion', sourceLabel: 'Fusion — Pricing' },
  offer_moq:        { value: '1', confidence: 0.9, state: 'sourced', source: 'fusion', sourceLabel: 'Fusion — Pricing' },
  flash_point:      { value: '210°C (COC)', confidence: 0.93, state: 'sourced', source: 'msds', sourceLabel: 'MSDS — Section 9' },
  hazard_class:      { value: 'Not classified as hazardous', confidence: 0.91, state: 'sourced', source: 'msds', sourceLabel: 'MSDS — Section 2' },
};

export const CATEGORY_DEFS: CategoryDef[] = [
  { key: 'supplier_description', name: 'Supplier Description' },
  { key: 'product_identity',     name: 'Product Identity' },
  { key: 'product_details',      name: 'Product Details' },
  { key: 'offer',                name: 'Offer' },
  { key: 'safety_compliance',    name: 'Safety & Compliance' },
];

export const CATEGORY_STATS: Record<string, CategoryStats> = {
  supplier_description: { total: 2,  populated: 2,  review: 0 },
  product_identity:     { total: 13, populated: 13, review: 0 },
  product_details:      { total: 27, populated: 26, review: 1 },
  offer:                { total: 3,  populated: 3,  review: 0 },
  safety_compliance:    { total: 8,  populated: 8,  review: 0 },
};

export const SUGGESTIONS: Record<string, Suggestion[]> = {
  viscosity_grade: [
    { value: '5W-30', confidence: 0.96, label: 'Recommended', tone: 'good' },
    { value: '5W-40', confidence: 0.38, label: 'Possible', tone: 'warn' },
    { value: '0W-30', confidence: 0.19, label: 'Unlikely', tone: 'bad' },
  ],
};

export const TOTAL_FIELDS_IN_TEMPLATE = 145;
export const FOOTER_BASELINE_POPULATED = 53;