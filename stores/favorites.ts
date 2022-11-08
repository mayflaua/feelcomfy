import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'
import { ProductID } from '~/types/product'
import { FavoritesListItemWithRating } from '~/types/favorites'
import { useProductsStore } from '~/stores/products'

const { supabase } = useSupabase()

export const useFavoritesStore = defineStore('newFavorites', {
  state: () => ({
    user: null as string | null,
    _compressedFavorites: null as ProductID[] | null,
    favorites: null as FavoritesListItemWithRating[] | null,

    favoritesReady: false,
    _fetchingCompressed: false,
    _updating: false,

    // Disables sync with database for testing purposes
    _noSync: false
  }),

  getters: {
    // Returns the number of unique products in favorites
    totalFavorites (state): number {
      return state._compressedFavorites?.length || 0
    },

    // Indicates if product is in favorites
    isInFavorites (state): (id: ProductID) => boolean {
      return id => state._compressedFavorites?.includes(id) || false
    }
  },

  actions: {
    // Set user ID
    setUser (user: string): void {
      this.user = user
    },

    // Fetch products from database depending on compressed favorites list
    async getFavoritesFromDatabase () : Promise<void> {
      if (!this._compressedFavorites && !this._fetchingCompressed) {
        await this._getCompressedFavorites()
      }

      if (this._compressedFavorites) {
        const productsScore = useProductsStore()

        this.favorites = await productsScore.getProductsByIds(this._compressedFavorites)
        this.favoritesReady = true
      }
    },

    // Fetch compressed favorites for currently logged-in user
    async _getCompressedFavorites () {
      if (this.user) {
        this._fetchingCompressed = true
        const { data, error } = await supabase
          .from('favorites')
          .select('favorites')
          .eq('user_id', this.user)
        if (error) { throw error }

        this._compressedFavorites = data[0].favorites
        this._fetchingCompressed = false
      }
    },

    // Adds a product id to  favorites
    async _addToFavorites (id: ProductID): Promise<void> {
      if (this._compressedFavorites && this.favorites) {
        const productsScore = useProductsStore()
        const product = await productsScore.getProductById(id)

        this._compressedFavorites.push(id)
        // TODO: remove index when refactor productsScore
        this.favorites.push(product[0])
      }
    },

    // Removes a product id from favorites
    _removeFromFavorites (id: ProductID): void {
      if (this._compressedFavorites && this.favorites) {
        this._compressedFavorites = this._compressedFavorites.filter(_ => _ !== id)
        this.favorites = this.favorites.filter(_ => _.pk_id !== id)
      }
    },

    // Perform adding or removing product from favorites
    async handleFavoritesAction (id: ProductID): Promise<void> {
      if (!this.favorites) { await this.getFavoritesFromDatabase() }

      this.isInFavorites(id)
        ? this._removeFromFavorites(id)
        : await this._addToFavorites(id)

      await this._updateDatabase()
    },

    // Perform synchronisation of locally stored favorites and favorites in database
    async _updateDatabase (): Promise<void> {
      if (!this._noSync) {
        this._updating = true

        if (this.user) {
          const { error } = await supabase
            .from('favorites')
            .update({ favorites: this._compressedFavorites })
            .eq('user_id', this.user)

          if (error) { throw error }
        } else {
          throw new Error(`Favorites sync went wrong. ${this.user} is not a valid user ID`)
        }

        this._updating = false
      }
    },

    // Reset both compressed and full favorites lists
    // Sync with database if withUpdate arg is true
    async resetFavorites (withUpdate: boolean = false): Promise<void> {
      this.favorites = null
      this._compressedFavorites = null

      if (withUpdate) {
        await this._updateDatabase()
      }
    },

    // For testing purposes
    disableSync (): void {
      this._noSync = true
    },

    setFavorites (favorites: FavoritesListItemWithRating[]): void {
      this.favorites = favorites
    },

    setCompressedFavorites (favorites: ProductID[]): void {
      this._compressedFavorites = favorites
    }
  }
}
)
