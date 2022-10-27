import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'
import { Order, OrderID, OrderProduct, OrderProductCompressed } from '~/types/orders'
import { ProductID } from '~/types/product'

const { supabase } = useSupabase()

export const useOrdersStore = defineStore('order', {
  state: () => ({
    _goods: [] as OrderProduct[],
    orders: [] as Order[],

    fetchState: false as boolean
  }),
  actions: {
    async getOrders (userId): Promise<void> {
      this.fetchState = true
      const { data } = await supabase
        .from('orders')
        .select('order_id, order, created_at, status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      const orders: Order[] = data

      orders.forEach((currentOrder) => {
        currentOrder.worth = currentOrder.order.reduce((acc, curr) =>
          acc + curr.qty * curr.price
        , 0)
      })

      const goodsIdsToFetch: ProductID[] = Array.from(new Set(orders.map(order => order.order.map(good => good.id)).flat()))
      const { data: goods } = await supabase
        .from('goods')
        .select('pk_id, title, netlify_name, model, color')
        .in('pk_id', goodsIdsToFetch)

      this._goods = goods

      orders.forEach((order) => {
        order.order = order.order.map((item) => {
          const product = this._goods.find(product => product.pk_id === item.id)
          return {
            ...item,
            ...product
          }
        })
      })

      this.orders = orders
      this.fetchState = false
    },

    async makeOrder (order): Promise<OrderID> {
      // update products units_in_stock column
      for (const product of order) {
        await supabase
          .from('goods')
          .update({ units_in_stock: product.units_in_stock - product.qty })
          .eq('pk_id', product.id)
      }

      // remove units_in_stock key in order
      order.map(i => delete i.units_in_stock)

      // adding order to database and return its order_id
      const { data: res } = await supabase
        .from('orders')
        .insert({
          user_id: supabase.auth.user().id,
          order,
          status: 'not-paid'
        }
        )
      return res[0].order_id
    },

    async submitOrder (orderId: OrderID): Promise<void> {
      await supabase
        .from('orders')
        .update({ status: 'created' })
        .eq('order_id', orderId)
    },

    async getOrderInfo (orderId: OrderID): Promise<OrderProductCompressed[]> {
      /* get order info from database */
      const { data: res } = await supabase
        .from('orders')
        .select('order')
        .eq('order_id', orderId)

      /* list all goods ids */
      const ids: ProductID[] = res[0].order.map(item => item.id)

      /* select goods with listed ids from database */
      const { data: goods } = await supabase
        .from('goods')
        .select('title, netlify_name, model, color, pk_id, units_in_stock')
        .in('pk_id', ids)

      /* push price and qty from order to goods list */
      goods.forEach((item) => {
        const index =
          res[0].order[
            res[0].order.findIndex(i => i.id === item.pk_id)
          ]
        item.qty = index.qty
        item.final_price = index.price
      })

      return goods
    }
  }
})
