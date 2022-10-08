import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'

const { supabase } = useSupabase()

export const useReviewsStore = defineStore('reviews', {
  state: () => ({}),
  getters: {},
  actions: {
    async getReviewsByProductId (id: number): Promise<Object[]> {
      const { data: res } = await supabase
        .from('reviews')
        .select('user_name, score, text, created_at, is_anon')
        .eq('item_id', id)
      return res
    },

    async uploadReview (review: object): Promise<void> {
      await supabase.from('reviews').insert({
        ...review,
        user_name: supabase.auth.user().user_metadata.name,
        user_id: supabase.auth.user().id
      }, { returning: 'minimal' })
    }
  }
})
