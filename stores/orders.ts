import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'

const { supabase } = useSupabase()

export const useOrdersStore = defineStore('order', {
  state: () => ({
    _goods: [],
    orders: []
  }),
  getters: {},
  actions: {
    getOrders: async function (userId) {
      const { data: orders } = await supabase.from('orders')
        .select('order_id, order, created_at, status')
        .eq('user_id', userId)
        .order('created_at')
      orders.forEach((currentOrder) => {
        currentOrder.worth = currentOrder.order.reduce((acc, curr) =>
          acc + curr.qty * curr.price
        , 0)
      })

      const goodsIdsToFetch = Array.from(new Set(orders.map(order => order.order.map(good => good.id)).flat()))
      const { data: goods } = await supabase.from('goods')
        .select('pk_id, title, thumbnail_url, model, color')
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
    }
  }
})
