import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'
import useSearch from '~/composables/useSearch'
import { ProductCategory } from '~/types/categories'
import { Product, ProductWithRating } from '~/types/product'

const { supabase } = useSupabase()

enum Filter {
  POPULAR = 'orders',
  BEST_RATING = 'score',
  // TODO: больше фильтров
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    isLoading: false,
    _productsAvailableInDatabase: null
  }),

  getters: {},

  actions: {
    async getProductsFromDatabase (items): Promise<Object[]> {
      this.isLoading = true
      const { data: res } = await supabase
        .from('goods')
        .select('*, reviews!left(score)')
        .range(this.totalProductsLoaded, this.totalProductsLoaded + items - 1)

      const { count: prodCount } = await supabase
        .from('goods')
        .select('pk_id', { count: 'exact', head: true })
      this._productsAvailableInDatabase = prodCount
      this.isLoading = false

      return this._destructureRating(res)
    },

    async getProductsByCategory (category: ProductCategory, limit: number = 10): Promise<Object[]> {
      const { data: res } = await supabase.from('goods')
        .select('*, reviews!left(score)')
        // @ts-ignore
        .eq('category_id', ProductCategory[category.toUpperCase()])
        .limit(limit)
      return this._destructureRating(res)
    },

    async getProductsByQuery (query: string, limit: number = 10): Promise<Object[]> {
      // eslint-disable-next-line no-undef
      const { findByQuery } = useSearch()
      const res = await findByQuery(query, limit)
      return this._destructureRating(res)
    },

    async getProductsByFilter (filter: Filter, limit: number = 10): Promise<Object[]> {
      const { data: res } = await supabase.from('goods')
        .select('*, reviews!left(score)')
        .order(Filter[filter.toUpperCase()], { ascending: false })
        .limit(limit)

      return this._destructureRating(res)
    },

    async getProductById (id) {
      const { data: res } = await supabase
        .from('goods')
        .select('*, reviews!left(score)')
        .eq('pk_id', id)
      return this._destructureRating(res)
    },

    async getProductsByIds (ids) {
      const { data: res } = await supabase
        .from('goods')
        .select('*, reviews!left(score)')
        .in('pk_id', ids)
      return this._destructureRating(res)
    },

    _destructureRating (arr: Array<Product>): Array<ProductWithRating> {
      const res: Array<ProductWithRating> = []
      arr.forEach((product) => {
        const reviews = product.reviews
        const mappedProduct: ProductWithRating = {
          ...product,
          reviews: reviews.length,
          score: (reviews
            .map(i => i.score)
            .reduce((acc, num) => acc + num, 0) / (reviews.length || 1))
            .toFixed(1)
        }
        res.push(mappedProduct)
      })
      return res
    }

  }
})
