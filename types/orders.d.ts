export interface OrderProduct {
  readonly pk_id: number
  title: string
  netlify_name: string
  model: string | null
  color: string | null
}

export interface Order {
  readonly order_id: number
  status: 'granted' | 'created' | 'not-paid'
  worth: number
  order: OrderProduct[]
}
