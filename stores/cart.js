import { defineStore } from "pinia";

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
    addToCart(id, qty) {
      if (!this.isInCart(id)) {
        this.cart.push({ id, qty });
        console.log(`added ${qty} item(s) with id ${id} to cart`);
      } else {
        console.log("already in cart");
      }
    },
    changeQuantity(id, qty) {
      if (this.isInCart(id)) {
        this.cart[this.cart.findIndex((item) => item.id == id)].qty += qty;
      }
    },
    removeFromCart(id) {
      if (this.isInCart(id)) {
        const index = this.cart.indexOf(id);
        if (index > -1) {
          this.cart.splice(index, 1);
          console.log(`removed item with id ${id} from cart`);
        }
      } else {
        console.log("item isnt in cart");
      }
    },
  },
});
