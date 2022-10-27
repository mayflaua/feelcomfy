import { Product, ProductID, ProductWithRating } from '~/types/product'

export interface CartItem extends Product {
  checked: boolean
  qty: number
}

export interface CompressedCartItem {
  readonly pk_id: ProductID
  qty: number
}

export interface CartItemWithRating extends ProductWithRating {
}
