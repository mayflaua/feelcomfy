import { ProductID } from '~/types/product'

export type OrderID = number

export interface OrderProductCompressed {
  readonly id: ProductID
  qty: number
  price: number
}

export interface OrderProduct extends OrderProductCompressed{
  title: string
  netlify_name: string
  model: string | null
  color: string | null
}

export interface Order {
  readonly order_id: OrderID
  created_at: string
  status: 'granted' | 'created' | 'not-paid'
  worth: number
  order: OrderProduct[]
}
