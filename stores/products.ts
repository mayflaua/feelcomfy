import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'

const { supabase } = useSupabase()

export const useProductsStore = defineStore('products', {
  state: () => ({
    productsList: [],
    isLoading: false,
    _productsAvailableInDatabase: null
  }),

  getters: {
    totalProductsLoaded: state => state.productsList.length,
    productsCanBeLoaded: state => state._productsAvailableInDatabase - state.productsList.length
  },

  actions: {
    async getProductsFromDatabase (items): Promise<void> {
      this.isLoading = true
      const { data: res } = await supabase
        .from('goods')
        .select()
        .range(this.totalProductsLoaded, this.totalProductsLoaded + items - 1)
      this.productsList.push(...res)

      const { count: prodCount } = await supabase
        .from('goods')
        .select('pk_id', { count: 'exact', head: true })
      this._productsAvailableInDatabase = prodCount
      this.isLoading = false
    }
  }
})
