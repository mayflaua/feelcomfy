import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'

const { supabase } = useSupabase()

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    _compressedFavoritesList: [] as Number[],
    favoritesList: [],

    favoritesReady: false,

    _fetchingCompressed: false
  }),
  getters: {
    isInFavorites: state => itemID =>
      state._compressedFavoritesList.includes(itemID),
    totalFavorites: state =>
      state._compressedFavoritesList.length
  },
  actions: {
    async handleFavoritesAction (itemID): Promise<void> {
      // fetch favorites if it wasnt fetched
      if (this.prefetchedFavoritesSize) {
        await this.getFavoritesFromDatabase()
      }

      this.isInFavorites(itemID)
        ? await this._removeFromFavorites(itemID)
        : await this._addToFavorites(itemID)
    },
    async _addToFavorites (itemID): Promise<void> {
      this._compressedFavoritesList.push(itemID)
      await this._updateDatabase()
    },
    async _removeFromFavorites (itemID): Promise<void> {
      const index = this._compressedFavoritesList.indexOf(itemID)

      // remove from compressed list
      this._compressedFavoritesList.splice(index, 1)

      // remove from full list
      this.favoritesList.splice(this.favoritesList.findIndex(item => item.pk__id === itemID), 1)
      await this._updateDatabase()
    },

    async _updateDatabase (): Promise<void> {
      await supabase
        .from('favorites')
        .update({ favorites: this._compressedFavoritesList })
        .eq('user_id', supabase.auth.user().id)
    },

    async getCompressedFavoritesList (): Promise<void> {
      this._fetchingCompressed = true

      const { data: response } = await supabase
        .from('favorites')
        .select('favorites')
        .eq('user_id', supabase.auth.user().id)
      this._compressedFavoritesList = response[0].favorites
      this._fetchingCompressed = false
    },

    async getFavoritesFromDatabase (): Promise<void> {
      if (!this._fetchingCompressed && this.totalFavorites !== 0) {
        // fetch all products info by compressed list ids if compressed already fetched
        const { data: res } = await supabase
          .from('goods')
          .select()
          .in('pk_id', this._compressedFavoritesList)

        this.favoritesList = res
        this.favoritesReady = true
      } else {
        // retry fetch if compressedFavorites isnt fetched yet

        setTimeout(async () => await this.getFavoritesFromDatabase(), 10)
      }
    },

    async getFavoritesSize (): Promise<void> {
      // get only users favorites size for nav icon
      const { data: res } = await supabase
        .from('favorites')
        .select('favorites_size')
        .eq('user_id', supabase.auth.user().id)
      this.prefetchedFavoritesSize = res[0].favorites_size
    }
  }
})
