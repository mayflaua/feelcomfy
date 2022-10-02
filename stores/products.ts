import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'

const { supabase } = useSupabase()

enum ProductCategory {
  MOUSE = 1,
  KEYBOARD = 2,
  CHAIR = 3,
  TABLE = 4,
  MONITOR = 5,
  MERCH = 6
}

enum Filter {
  POPULAR = 'orders', // TODO: должно быть rating, но пока что их нет
  // TODO: больше фильтров
}

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
    },

    async getProductsByCategory (category: ProductCategory, limit: number = 10) {
      const { data: res } = await supabase.from('goods')
        .select()
        // @ts-ignore
        .eq('category_id', ProductCategory[category.toUpperCase()])
        .limit(limit)
      return res
    },

    async getProductsByQuery (query: string, limit: number = 10) {
      // eslint-disable-next-line no-undef
      const { findByQuery } = useSearch()
      return await findByQuery(query, limit)
    },

    async getProductsByFilter (filter: Filter, limit: number = 10) {
      const { data: res } = await supabase.from('goods')
        .select()
        .order(Filter[filter.toUpperCase()], { ascending: false })
        .limit(limit)
      return res
    }
  }
})
