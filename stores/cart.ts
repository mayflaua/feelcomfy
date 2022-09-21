import { defineStore, StoreDefinition } from "pinia";

const { supabase } = useSupabase();

interface CompressedCartItem {
  readonly pk_id: number;
  qty: number;
}

interface CartItem {
  readonly pk_id: number;
  readonly category_id: number;
  title: string;
  old_price?: number | null;
  final_price: number;
  units_in_stock: number;
  image_url: URL;
  thumbnail_url: URL;
  model?: string;
  color?: string;
  orders: number;
}

export const useCartStore: StoreDefinition = defineStore("cart", {
  state: () => ({
    /* actual stored in db cart data */
    _cartCompressed: [] as CompressedCartItem[],
    /* cart data to render on ui */
    cart: [] as CartItem[],

    defaultCheckboxValue: true,
    freeDeliveryCondition: 8000,
  }),

  getters: {
    isInCart:
      <Boolean>(state) =>
      (item_id: number) =>
        state._cartCompressed.some(
          (item: CompressedCartItem) => item.pk_id == item_id
        ),

    allChecked: <Boolean>(state) => state.cart.every((item) => item.checked),

    getCheckValue:
      <Boolean>(state) =>
      (item_id: number) =>
        state.cart.find((item) => item.pk_id == item_id).checked,

    totalItems: <Number>(state) => state._cartCompressed?.length || 0,

    totalCartWorth: <Number>(state) =>
      state.cart.reduce((acc, curr) => acc + curr.qty * curr.final_price, 0),

    totalSelectedItemsWorth: <Number>(state) =>
      state.cart.reduce(
        (acc, curr) =>
          /* consider only checked items */
          curr.checked ? acc + curr.qty * curr.final_price : acc,
        0
      ),

    totalCartWorthWithDelivery: <Number>(state) =>
      state.totalSelectedItemsWorth + (state.isFreeDelivery ? 0 : 1000),

    freeDeliveryPercent: <Number>(state) =>
      Math.min(
        (state.totalCartWorthWithDelivery / state.freeDeliveryCondition) * 100,
        100
      ),

    isFreeDelivery: <Boolean>(state) =>
      state.totalSelectedItemsWorth >= state.freeDeliveryCondition,

    summarySaving: <Number>(state) =>
      state.cart.reduce(
        (acc, curr) =>
          /* consider checked items that have old price */
          curr.old_price && curr.checked
            ? acc + curr.qty * (curr.old_price - curr.final_price)
            : acc,
        0
      ),
  },
  actions: {
    async _addToCart(item_id: number) {
      this._cartCompressed.push({ pk_id: item_id, qty: 1 });

      const { data: addedItem } = await supabase
        .from("goods")
        .select()
        .eq("pk_id", item_id);

      this.cart.push({
        ...addedItem[0],
        qty: 1,
        checked: this.defaultCheckboxValue,
      });
      this._updateDatabase();
    },

    async _removeFromCart(item_id: number) {
      /* remove items from both compressed and normal carts */

      this._cartCompressed.splice(
        this._cartCompressed.findIndex(
          (item: CompressedCartItem) => item.pk_id == item_id
        ),
        1
      );
      this.cart.splice(
        this.cart.findIndex((item: CartItem) => item.pk_id == item_id),
        1
      );
      this._updateDatabase();
    },

    async changeQuantity(item_id: number, value: number): Promise<void> {
      /* change quantity in stored compressed cart and on ui*/
      const currentItem = this.cart.find((item) => item.pk_id == item_id);
      if (
        (currentItem.qty > 0 && currentItem.qty < currentItem.units_in_stock) ||
        (currentItem.qty >= currentItem.units_in_stock && value < 0)
      ) {
        this._cartCompressed.find((item) => item.pk_id == item_id).qty += value;
        this.cart.find((item) => item.pk_id == item_id).qty += value;

        /* update database only after 3 seconds of the last change to reduce database requests */
        /* may not work and be unefficient but idk i did my best :P */
        const initialValue = this._cartCompressed.find(
          (item) => item.pk_id == item_id
        ).qty;
        const timer = setTimeout(() => {
          const currentValue = this._cartCompressed.find(
            (item) => item.pk_id == item_id
          ).qty;
          if (currentValue == initialValue) {
            this._updateDatabase();
          }
        }, 3000);
      }
    },

    handleCheckAllClick() {
      const allCheckedBeforeClick = this.allChecked;
      for (const obj of this.cart) {
        obj.checked = !allCheckedBeforeClick;
      }
    },

    handleCheck(pk_id: number) {
      const itemToChange = this.cart.find((item) => item.pk_id == pk_id);
      itemToChange.checked = !itemToChange.checked;
    },

    async handleCartAction(item_id: number): Promise<void> {
      /* add or remove item from cart */
      this.isInCart(item_id)
        ? this._removeFromCart(item_id)
        : this._addToCart(item_id);
    },

    async getCartFromDatabase(user_id): Promise<void> {
      try {
        /* get compressed cart and store it */
        const { data: compressedCart } = await supabase
          .from("carts")
          .select("cart")
          .eq("user_id", user_id);
        this._cartCompressed = compressedCart[0].cart;

        /* get full cart items info and store it */
        let { data: fullCart } = await supabase
          .from("goods")
          .select()
          .in(
            "pk_id",
            this._cartCompressed.map((item: CompressedCartItem) => item.pk_id)
          );

        // add qty and checked property to every item in cart
        for (const el of fullCart) {
          el.checked = this.defaultCheckboxValue;
          el.qty = this._cartCompressed.find(
            (item) => item.pk_id == el.pk_id
          ).qty;
        }
        this.cart = fullCart;
      } catch (err) {
        throw err;
      }
    },

    async _updateDatabase(): Promise<void> {
      /* update user cart in database */
      await supabase
        .from("carts")
        .update({ cart: this._cartCompressed })
        .eq("user_id", supabase.auth.user().id);
      return;
    },
  },
});
