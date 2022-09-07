import { defineStore } from "pinia";
const { supabase } = useSupabase();

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [],
  }),

  getters: {
    getCart: (state) => state.cart,
    isInCart: (state) => (id) => state.cart.some((el) => el.id == id),
    totalItems: (state) => state.cart.length,
    totalQuantity: (state) =>
      state.cart.reduce((acc, curr) => acc + curr.qty, 0),
  },

  actions: {
    async addToCart(id, qty) {
      if (!this.isInCart(id)) {
        try {
          this.cart.push({ id, qty });
          await this._updateDatabase();

          console.log(`added ${qty} item(s) with id ${id} to cart`);
        } catch (err) {
          throw err;
        }
      }
    },

    async changeQuantity(id, qty) {
      try {
        if (this.isInCart(id)) {
          this.cart[this.cart.findIndex((item) => item.id == id)].qty += qty;
          await this._updateDatabase();
        }
      } catch (err) {
        throw err;
      }
    },

    async removeFromCart(id) {
      try {
        if (this.isInCart(id)) {
          const index = this.cart.findIndex((item) => item.id == id);
          if (index > -1) {
            this.cart.splice(index, 1);
            await this._updateDatabase();
            console.log(`removed item with id ${id} from cart`);
          }
        } else {
          throw new Error("Item isn't in cart");
        }
      } catch (err) {
        throw err;
      }
    },

    async _getUser() {
      const { user } = useAuth();
      return user;
    },

    async _updateDatabase() {
      const user = await this._getUser();

      await supabase
        .from("carts")
        .update({ cart: this.cart })
        .eq("user_id", user.value.id);
    },

    async getCartFromDatabase() {
      const user = await this._getUser();
      try {
        if (user.value) {
          const response = await supabase
            .from("carts")
            .select("cart")
            .eq("user_id", user.value.id);
          this.cart = response.data[0].cart;
          return response.data[0].cart;
        }
      } catch (err) {
        throw err;
      }
    },
  },
});
