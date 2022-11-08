import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'
import useSearch from '~/composables/useSearch'
import { Filter, ProductCategory } from '~/types/categories.d'
import { Product, ProductID, ProductWithRating } from '~/types/product'

const { supabase } = useSupabase()

export const useProductsStore = defineStore('products', {
  actions: {
    async getProductsByCategory (category: ProductCategory, limit: number = 10): Promise<ProductWithRating[]> {
      const { data: res } = await supabase.from('goods')
        .select('*, reviews!left(score)')
        .eq('category_id', category)
        .limit(limit)
      if (res) { return this._destructureRating(res) }
      return []
    },

    async getProductsByQuery (query: string, limit: number = 10): Promise<ProductWithRating[]> {
      const { findByQuery } = useSearch()
      const res = await findByQuery(query, limit)
      return this._destructureRating(res)
    },

    async getProductsByFilter (filter: Filter, limit: number = 10): Promise<ProductWithRating[]> {
      const { data: res } = await supabase.from('goods')
        .select('*, reviews!left(score)')
        .order(filter, { ascending: false })
        .limit(limit)

      if (res) { return this._destructureRating(res) }
      return []
    },

    async getProductById (id: ProductID): Promise<ProductWithRating | undefined> {
      const { data: res } = await supabase
        .from('goods')
        .select('*, reviews!left(score)')
        .eq('pk_id', id)
      if (res) { return this._destructureRating(res)[0] }
      return undefined
    },

    async getProductsByIds (ids: ProductID[]): Promise<ProductWithRating[]> {
      const { data: res } = await supabase
        .from('goods')
        .select('*, reviews!left(score)')
        .in('pk_id', ids)
      if (res) { return this._destructureRating(res) }
      return []
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
