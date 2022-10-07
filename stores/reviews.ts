import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'

const { supabase } = useSupabase()

export const useReviewsStore = defineStore('reviews', {
  state: () => ({}),
  getters: {},
  actions: {
    async getReviewsByProductId (id: number) {
      const { data: res } = await supabase
        .from('reviews')
        .select('user_name, score, text, created_at')
        .eq('item_id', id)
      return res
    },

    async getRatingByProductId (id: number) {
      const { data } = await supabase
        .from('goods')
        .select('reviews!inner(score)')
        .eq('pk_id', id)

      const ratingList = data.length !== 0 ? data[0].reviews.map(i => i.score) : []
      const reviews = ratingList.length
      const rating = (ratingList.reduce((acc, num) => acc + num, 0) / (reviews || 1)).toFixed(1)

      return {
        reviews,
        rating
      }
    }
  }
})
