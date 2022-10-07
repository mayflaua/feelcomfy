import { defineStore, StoreDefinition } from 'pinia'
import useSupabase from '~/composables/useSupabase'

const { supabase } = useSupabase()

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
  model?: string;
  color?: string;
  orders: number;
}

export const useCartStore: StoreDefinition = defineStore('cart', {
  state: () => ({
    /* actual stored in db cart data */
    _cartCompressed: [] as CompressedCartItem[],
    /* cart data to render on ui */
    cart: [] as CartItem[],

    defaultCheckboxValue: true,
    freeDeliveryCondition: 8000,

    cartReady: false,

    _fetchingCompressed: false
  }),

  getters: {
    isInCart:
      state =>
        (itemID: number) =>
          state._cartCompressed.some(
            (item: CompressedCartItem) => item.pk_id === itemID
          ),

    allChecked: state => state.cart.every(item => item.checked),

    getCheckValue:
      state =>
        (itemID: number) =>
          state.cart.find(item => item.pk_id === itemID).checked,

    totalItems: state =>
      state._cartCompressed.length,

    totalCartWorth: state =>
      state.cart.reduce((acc, curr) => acc + curr.qty * curr.final_price, 0),

    totalSelectedItemsWorth: state =>
      state.cart.reduce(
        (acc, curr) =>
          /* consider only checked items */
          curr.checked ? acc + curr.qty * curr.final_price : acc,
        0
      ),

    totalCartWorthWithDelivery: state =>
      state.totalSelectedItemsWorth + (state.isFreeDelivery ? 0 : 1000),

    freeDeliveryPercent: state =>
      Math.min(
        (state.totalSelectedItemsWorth / state.freeDeliveryCondition) * 100,
        100
      ),

    isFreeDelivery: state =>
      state.totalSelectedItemsWorth >= state.freeDeliveryCondition,

    summarySaving: state =>
      state.cart.reduce(
        (acc, curr) =>
          /* consider checked items that have old price */
          curr.old_price && curr.checked
            ? acc + curr.qty * (curr.old_price - curr.final_price)
            : acc,
        0
      )
  },
  actions: {
    async _addToCart (itemID: number, qty: number = 1) {
      this._cartCompressed.push({ pk_id: itemID, qty })

      const { data: addedItem } = await supabase
        .from('goods')
        .select()
        .eq('pk_id', itemID)

      this.cart.push({
        ...addedItem[0],
        qty,
        checked: this.defaultCheckboxValue
      })
      await this._updateDatabase()
    },

    async _removeFromCart (itemID: number) {
      /* remove items from both compressed and normal carts */

      this._cartCompressed.splice(
        this._cartCompressed.findIndex(
          (item: CompressedCartItem) => item.pk_id === itemID
        ),
        1
      )
      this.cart.splice(
        this.cart.findIndex((item: CartItem) => item.pk_id === itemID),
        1
      )
      await this._updateDatabase()
    },

    changeQuantity (itemID: number, value: number): void {
      /* change quantity in stored compressed cart and on ui */
      const currentItem = this.cart.find(item => item.pk_id === itemID)
      if (
        (currentItem.qty > 0 && currentItem.qty < currentItem.units_in_stock) ||
        (currentItem.qty >= currentItem.units_in_stock && value < 0)
      ) {
        this._cartCompressed.find(item => item.pk_id === itemID).qty += value
        this.cart.find(item => item.pk_id === itemID).qty += value

        /* update database only after 3 seconds of the last change to reduce database requests */
        /* may not work and be inefficient but idk i did my best :P */
        const initialValue = this._cartCompressed.find(
          item => item.pk_id === itemID
        ).qty
        setTimeout(async () => {
          const currentValue = this._cartCompressed.find(
            item => item.pk_id === itemID
          ).qty
          if (currentValue === initialValue) {
            await this._updateDatabase()
          }
        }, 3000)
      }
    },

    handleCheckAllClick () {
      const allCheckedBeforeClick = this.allChecked
      for (const obj of this.cart) {
        obj.checked = !allCheckedBeforeClick
      }
    },

    handleCheck (itemID: number) {
      const itemToChange = this.cart.find(item => item.pk_id === itemID)
      itemToChange.checked = !itemToChange.checked
    },

    async handleCartAction (itemID: number, qty: number = 1): Promise<void> {
      // fetch cart if it wasnt fetched
      if (this.prefetchedCartSize) {
        await this.getCartFromDatabase()
      }
      /* add or remove item from cart */
      this.isInCart(itemID)
        ? await this._removeFromCart(itemID)
        : await this._addToCart(itemID, qty)
    },

    async getCompressedCart (): Promise<void> {
      this._fetchingCompressed = true
      const { data: compressedCart } = await supabase
        .from('carts')
        .select('cart')
        .eq('user_id', supabase.auth.user().id)
      this._cartCompressed = compressedCart[0].cart
      this._fetchingCompressed = false
      this.cartReady = true
    },

    async getCartFromDatabase (): Promise<void> {
      if (!this._fetchingCompressed && this.totalItems !== 0) {
        /* get full cart items info and store it if compressed already fetched */

        const { data: fullCart } = await supabase
          .from('goods')
          .select()
          .in(
            'pk_id',
            this._cartCompressed.map((item: CompressedCartItem) => item.pk_id)
          )

        // add qty and checked property to every item in cart
        for (const el of fullCart) {
          el.checked = this.defaultCheckboxValue
          el.qty = this._cartCompressed.find(
            item => item.pk_id === el.pk_id
          ).qty
        }

        this.cart = fullCart
      } else {
        // retry fetch if compressedCart isnt fetched yet
        setTimeout(async () => {
          await this.getCartFromDatabase()
        }, 10)
      }
    },

    async _updateDatabase (): Promise<void> {
      /* update user cart in database */
      await supabase
        .from('carts')
        .update({ cart: this._cartCompressed })
        .eq('user_id', supabase.auth.user().id)
    }

  }
})
