export interface FormData {
  code: string;
  quantity: number | null;
}

export interface Product {
  name: string;
  code: string;
  price: number;
}

export interface ProductionRow {
  code: string;
  name: string;
  price: number;
  quantity: number;
  summary: number;
}

export type ProductionByDate = Record<string, ProductionRow[]>;
