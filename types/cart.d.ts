import { Product, ProductID, ProductWithRating } from '~/types/product'

export interface CartItem extends Product {
  checked: boolean
}

export interface CompressedCartItem {
  readonly pk_id: ProductID;
  qty: number;
}

export interface CartItemWithRating extends ProductWithRating {
}
