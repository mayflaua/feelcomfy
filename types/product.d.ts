import { ProductCategory } from '~/types/categories'

export type ProductID = number
export type Score = {
  score: number
}

export interface Product {
  readonly pk_id: ProductID
  readonly category_id: ProductCategory
  title: string
  old_price: number | null
  final_price: number
  units_in_stock: number
  netlify_name: string
  netlify_images: string[] | null
  model: string | null
  color: string | null
  orders: number
  additional_data: [] | null,
  reviews: Score[]
}

export interface ProductWithRating extends Product {
  score: string
  reviews: number
}
