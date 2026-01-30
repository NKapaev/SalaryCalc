import { carriageLiner } from './carriageLiner';
import { liner } from './liner';
import { products } from './products';

export const allProducts = [...products, ...liner, ...carriageLiner];
