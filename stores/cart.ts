import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'
import { CartItem, CompressedCartItem } from '~/types/cart'

const { supabase } = useSupabase()

const DEFAULT_CHECKBOX_VALUE: boolean = true
const FREE_DELIVERY_MIN_PRICE: number = 8000

export const useCartStore = defineStore('cart', {
  state: () => ({
    /* actual stored in db cart data */
    _cartCompressed: [] as CompressedCartItem[],
    /* cart data to render on ui */
    cart: [] as CartItem[],
    cartReady: false as boolean,
    _fetchingCompressed: false as boolean,
    _updating: false as boolean
  }),

  getters: {
    isInCart:
      state =>
        (itemID: number) =>
          state._cartCompressed.some(
            item => item.pk_id === itemID
          ),

    allChecked: state => state.cart.every(item => item.checked),
    anyChecked: state => state.cart.some(item => item.checked),

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

    totalCartWorthWithDelivery (): number {
      return this.totalSelectedItemsWorth + (this.isFreeDelivery ? 0 : 1000)
    },

    freeDeliveryPercent (): number {
      return Math.min(
        (this.totalSelectedItemsWorth / FREE_DELIVERY_MIN_PRICE) * 100,
        100
      )
    },

    isFreeDelivery (): boolean {
      return this.totalSelectedItemsWorth >= FREE_DELIVERY_MIN_PRICE
    },

    freeDeliveryDifference (): number {
      return FREE_DELIVERY_MIN_PRICE - this.totalSelectedItemsWorth
    },

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
    async _addToCart (itemID: number, qty: number = 1):Promise<void> {
      this._updating = true
      this._cartCompressed.push({ pk_id: itemID, qty })

      const { data: addedItem } = await supabase
        .from('goods')
        .select()
        .eq('pk_id', itemID)

      this.cart.push({
        ...addedItem[0],
        qty,
        checked: DEFAULT_CHECKBOX_VALUE
      })
      await this._updateDatabase()
      this._updating = false
    },

    async _removeFromCart (itemID: number, noUpdate: boolean = false): Promise<void> {
      this._updating = true
      /* remove items from both compressed and normal carts */

      this._cartCompressed.splice(
        this._cartCompressed.findIndex(
          item => item.pk_id === itemID
        ),
        1
      )
      this.cart.splice(
        this.cart.findIndex(item => item.pk_id === itemID),
        1
      )
      if (!noUpdate) {
        await this._updateDatabase()
      }
      this._updating = false
    },

    changeQuantity (itemID: number, value: number): void {
      this._updating = true

      /* change quantity in stored compressed cart and on ui */
      const currentItem = this.cart.find(item => item.pk_id === itemID)
      if (
        (currentItem.qty > 0 && currentItem.qty < currentItem.units_in_stock) ||
        (currentItem.qty >= currentItem.units_in_stock && value < 0)
      ) {
        this._cartCompressed.find(item => item.pk_id === itemID).qty += value
        this.cart.find(item => item.pk_id === itemID).qty += value

        /* update database only after 3 seconds of the last change to reduce database requests */
        /* may not work and be inefficient but IDK I did my best :P */
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
      this._updating = false
    },

    handleCheckAllClick (): void {
      this._updating = true

      const allCheckedBeforeClick = this.allChecked
      for (const obj of this.cart) {
        obj.checked = !allCheckedBeforeClick
      }

      this._updating = false
    },

    handleCheck (itemID: number): void {
      this._updating = true

      const itemToChange = this.cart.find(item => item.pk_id === itemID)
      itemToChange.checked = !itemToChange.checked

      this._updating = false
    },

    async handleCartAction (itemID: number, qty: number = 1): Promise<void> {
      this._updating = true
      // fetch cart if it wasn't fetched
      if (this.prefetchedCartSize) {
        await this.getCartFromDatabase()
      }
      /* add or remove item from cart */
      this.isInCart(itemID)
        ? await this._removeFromCart(itemID)
        : await this._addToCart(itemID, qty)
      this._updating = false
    },

    async removeCheckedItems (): Promise<void> {
      this._updating = true
      const temp: Array<CartItem> = Array.from(this.cart)
      for (const i of temp) {
        if (i.checked) {
          this._removeFromCart(i.pk_id, true)
        }
      }
      await this._updateDatabase()
      this._updating = false
    },

    async getCompressedCart (): Promise<void> {
      this._updating = true
      this._fetchingCompressed = true

      const { data: compressedCart } = await supabase
        .from('carts')
        .select('cart')
        .eq('user_id', supabase.auth.user().id)
      this._cartCompressed = compressedCart[0].cart

      this._updating = false
      this._fetchingCompressed = false
    },

    async getCartFromDatabase (): Promise<void> {
      this._updating = true

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
          el.checked = DEFAULT_CHECKBOX_VALUE
          el.qty = this._cartCompressed.find(
            item => item.pk_id === el.pk_id
          ).qty
        }

        this.cart = fullCart
        this.cartReady = true
      } else if (this._fetchingCompressed || this._updating) {
        // retry fetch if compressedCart isn't fetched yet
        setTimeout(async () => {
          await this.getCartFromDatabase()
        }, 10)
      }

      this._updating = false
    },

    async _updateDatabase (): Promise<void> {
      /* update user cart in database */
      await supabase
        .from('carts')
        .update({ cart: this._cartCompressed })
        .eq('user_id', supabase.auth.user().id)
    },

    async resetCart (withUpdate: boolean = false): Promise<void> {
      this.cart = []
      this._cartCompressed = []

      if (withUpdate) {
        await this._updateDatabase()
      }
    }

  }
})
