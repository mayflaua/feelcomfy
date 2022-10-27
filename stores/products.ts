import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'
import useSearch from '~/composables/useSearch'
// @ts-ignore
import { Filter, ProductCategory } from '~/types/categories.d.ts'
import { Product, ProductID, ProductWithRating } from '~/types/product'

const { supabase } = useSupabase()

export const useProductsStore = defineStore('products', {
  state: () => ({
    isLoading: false,
    _productsAvailableInDatabase: null
  }),

  getters: {},

  actions: {
    async getProductsFromDatabase (items: ProductID[]): Promise<ProductWithRating[]> {
      this.isLoading = true
      const { data: res } = await supabase
        .from('goods')
        .select('*, reviews!left(score)')
        .in('pk_id', items)

      const { count: prodCount } = await supabase
        .from('goods')
        .select('pk_id', { count: 'exact', head: true })
      this._productsAvailableInDatabase = prodCount
      this.isLoading = false

      return this._destructureRating(res)
    },

    async getProductsByCategory (category: ProductCategory, limit: number = 10): Promise<ProductWithRating[]> {
      const { data: res } = await supabase.from('goods')
        .select('*, reviews!left(score)')
        // @ts-ignore
        .eq('category_id', ProductCategory[category.toUpperCase()])
        .limit(limit)
      return this._destructureRating(res)
    },

    async getProductsByQuery (query: string, limit: number = 10): Promise<ProductWithRating[]> {
      // eslint-disable-next-line no-undef
      const { findByQuery } = useSearch()
      const res = await findByQuery(query, limit)
      return this._destructureRating(res)
    },

    async getProductsByFilter (filter: Filter, limit: number = 10): Promise<ProductWithRating[]> {
      const { data: res } = await supabase.from('goods')
        .select('*, reviews!left(score)')
        .order(Filter[filter.toUpperCase()], { ascending: false })
        .limit(limit)

      return this._destructureRating(res)
    },

    async getProductById (id): Promise<ProductWithRating[]> {
      const { data: res } = await supabase
        .from('goods')
        .select('*, reviews!left(score)')
        .eq('pk_id', id)
      return this._destructureRating(res)
    },

    async getProductsByIds (ids): Promise<ProductWithRating[]> {
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
