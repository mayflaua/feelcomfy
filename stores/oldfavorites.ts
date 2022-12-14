import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'
import { FavoritesListItem, FavoritesListItemWithRating } from '~/types/favorites'
import { ProductID } from '~/types/product'

const { supabase } = useSupabase()

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    _compressedFavoritesList: [] as ProductID[],
    favoritesList: [] as FavoritesListItemWithRating[],

    favoritesReady: false as boolean,
    _fetchingCompressed: false as boolean
  }),
  getters: {
    isInFavorites: state => itemID =>
      state._compressedFavoritesList.includes(itemID) as boolean,
    totalFavorites: state =>
      state._compressedFavoritesList.length as number
  },
  actions: {
    async handleFavoritesAction (itemID: ProductID): Promise<void> {
      this.isInFavorites(itemID)
        ? await this._removeFromFavorites(itemID)
        : await this._addToFavorites(itemID)
    },
    async _addToFavorites (itemID: ProductID): Promise<void> {
      this._compressedFavoritesList.push(itemID)
      await this._updateDatabase()
    },
    async _removeFromFavorites (itemID: ProductID): Promise<void> {
      const index = this._compressedFavoritesList.indexOf(itemID)

      // remove from compressed list
      this._compressedFavoritesList.splice(index, 1)

      // remove from full list
      this.favoritesList.splice(this.favoritesList.findIndex(item => item.pk_id === itemID), 1)
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
          .select('*, reviews!left(score)')
          .in('pk_id', this._compressedFavoritesList)
        this.favoritesList = this._destructureRating(res)
        this.favoritesReady = true
      } else {
        // retry fetch if compressedFavorites isn't fetched yet
        setTimeout(async () => await this.getFavoritesFromDatabase(), 10)
      }
    },

    _destructureRating (arr: Array<FavoritesListItem>): Array<FavoritesListItemWithRating> {
      const res: Array<FavoritesListItemWithRating> = []
      arr.forEach((product) => {
        const reviews = product.reviews
        const mappedProduct: FavoritesListItemWithRating = {
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
    },

    resetFavorites () {
      this.favoritesList = []
      this._compressedFavoritesList = []
    }
  }
})
