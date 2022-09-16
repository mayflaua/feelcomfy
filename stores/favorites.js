import { defineStore } from "pinia";
const { supabase } = useSupabase();

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    favoritesList: [],
  }),
  getters: {
    getFavorites: (state) => state.favoritesList,
    isInFavorites: (state) => (id) =>
      state.favoritesList?.includes(id) || false,
    totalFavorites: (state) => state.favoritesList?.length || 0,
  },
  actions: {
    async addToFavorites(id) {
      if (!this.isInFavorites(id)) {
        try {
          this.favoritesList.push(id);
          await this._updateDatabase();
        } catch (err) {
          throw err;
        }
      }
    },
    async removeFromFavorites(id) {
      try {
        if (this.isInFavorites(id)) {
          const index = this.favoritesList.indexOf(id);
          if (index > -1) {
            this.favoritesList.splice(index, 1);
            await this._updateDatabase();
          }
        }
      } catch (err) {
        throw err;
      }
    },

    async _updateDatabase() {
      const user = await this._getUser();

      await supabase
        .from("favorites")
        .update({ favorites: this.favoritesList })
        .eq("user_id", user.value.id);
    },

    async _getUser() {
      const { user } = useAuth();
      return user;
    },

    async getFavoritesFromDatabase() {
      const user = await this._getUser();
      try {
        if (user.value) {
          const response = await supabase
            .from("favorites")
            .select("favorites")
            .eq("user_id", user.value.id);
          this.favoritesList = response.data[0].favorites;

          return response.data[0].favorites;
        }
      } catch (err) {
        throw err;
      }
    },
  },
});
