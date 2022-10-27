import { ProductID } from '~/types/product'

export interface Review {
  readonly review_id: number
  readonly created_at: string
  readonly item_id: ProductID
  text: string
  score: number
  user_name: string
  is_anon: boolean
}
