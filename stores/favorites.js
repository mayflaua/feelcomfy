import { defineStore } from "pinia";

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    favoritesList: [],
  }),
  getters: {
    getFavorites: (state) => state.favoritesList,
    isInFavorites: (state) => (id) => state.favoritesList.includes(id),
    totalFavorites: (state) => state.favoritesList.length,
  },
  actions: {
    addToFavorites(id) {
      if (!this.isInFavorites(id)) {
        this.favoritesList.push(id);
        console.log(`added item with id ${id} to favorites`);
      } else {
        console.log("already in favorites");
      }
    },
    removeFromFavorites(id) {
      if (this.isInFavorites(id)) {
        const index = this.favoritesList.indexOf(id);
        if (index > -1) {
          this.favoritesList.splice(index, 1);
          console.log(`removed item with id ${id} from favorites`);
        }
      } else {
        console.log("item isnt in favorites");
      }
    },
  },
});
