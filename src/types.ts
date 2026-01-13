export interface FormData {
  code: string;
  quantity: number | null;
}

export interface Product {
  name: string;
  code: string;
  price: number;
}

export interface StoredProductionRow {
  code: string;
  quantity: number;
}

// данные для UI (расширенные)
export interface ProductionRow extends StoredProductionRow {
  name: string;
  price: number;
  summary: number;
}

export type ProductionByDate = Record<string, StoredProductionRow[]>;
