import { defineStore } from 'pinia'
import useSupabase from '~/composables/useSupabase'
import { CartItem, CompressedCartItem } from '~/types/cart'
import { Product, ProductID } from '~/types/product'

const { supabase } = useSupabase()

const DEFAULT_CHECKBOX_VALUE = true
const FREE_DELIVERY_MIN_PRICE = 8000

export const useCartStore = defineStore('newcart', {
  state: () => ({
    user: null as string | null,
    _compressedCart: null as CompressedCartItem[] | null,
    cart: null as CartItem[] | null,

    cartReady: false,
    _fetchingCompressed: false,
    _updating: false,

    // Disables sync with database for testing purposes
    _noSync: false
  }),

  getters: {
    // Returns boolean indicating if product is in cart.
    isInCart (state): (id: ProductID) => boolean {
      return id => state._compressedCart?.some(item => item.pk_id === id) || false as boolean
    },

    // Returns quantity of products with given ID in cart or null if no such products in cart
    getQuantity (state): (id: ProductID) => number | null {
      return id => state._compressedCart?.find(item => item.pk_id === id)?.qty || null
    },

    // Indicates if all products in cart are checked
    allChecked (state): boolean {
      return state.cart?.every(item => item.checked) || false
    },
    // Indicates if any product in cart is checked
    anyChecked (state): boolean {
      return state.cart?.some(item => item.checked) || false
    },

    // Returns the number of unique products in cart
    totalItems (state): number {
      return state._compressedCart?.length || 0
    },
    // Returns total cart worth
    totalCartWorth (state): number {
      return state.cart?.reduce((acc, curr) => acc + curr.qty * curr.final_price, 0) || 0
    },
    // Returns total worth of checked products
    totalSelectedItemsWorth (state): number {
      return state.cart?.reduce((acc, curr) => acc + curr.final_price * (curr.checked ? curr.qty : 0), 0) || 0
    },
    // Returns total selected products worth including delivery
    totalCartWorthWithDelivery (): number {
      return this.totalSelectedItemsWorth + (this.isFreeDelivery ? 0 : 1000)
    },
    // Returns boolean indicating if delivery will be free
    isFreeDelivery (): boolean {
      return this.totalSelectedItemsWorth >= FREE_DELIVERY_MIN_PRICE
    },
    // Returns the percentage (0-100) of relation selected products worth and free delivery minimal price
    freeDeliveryPercent (): number {
      return Math.min((this.totalSelectedItemsWorth / FREE_DELIVERY_MIN_PRICE * 100), 100)
    },
    // Returns the difference between free delivery minimal price and selected products worth
    freeDeliveryDifference (): number {
      return FREE_DELIVERY_MIN_PRICE - this.totalSelectedItemsWorth
    },
    // Return the summary savings based on the products difference of old and final prices
    summarySaving (state): number {
      return state.cart?.reduce((acc, curr) => {
        /* consider only checked items with old price */
        return (curr.old_price && curr.checked)
          ? acc + curr.qty * (curr.old_price - curr.final_price)
          : acc
      }, 0) || 0
    }
  },

  actions: {
    // Set user ID
    setUser (user: string): void {
      this.user = user
    },

    // Get cart with all products depending on compressed cart
    async getCartFromDatabase (): Promise<void> {
      await this._getCompressedCart()

      if (this._compressedCart && this._compressedCart.length !== 0) {
      // Fetch all products from compressed cart
        const productIdsToFetch = this._compressedCart.map((p: CompressedCartItem) => p.pk_id)
        const { data, error } = await supabase
          .from('goods')
          .select()
          .in('pk_id', productIdsToFetch)
        if (error) {
          this.cart = []
          throw error
        }

        // Push products info and add qty and checked properties
        const cart: CartItem[] = []
        data.forEach((product) => {
          const productQty = this._compressedCart!.find(p => p.pk_id === product.pk_id)!.qty

          cart.push({
            ...product,
            qty: productQty,
            checked: DEFAULT_CHECKBOX_VALUE
          })
        })
        this.cart = cart
      } else if (this._compressedCart && this._compressedCart.length === 0) {
        this.cart = []
      }

      this.cartReady = true
    },

    // Fetch compressed cart for currently logged-in user
    async _getCompressedCart (): Promise<void> {
      if (this.user) {
        this._fetchingCompressed = true

        const { data, error } = await supabase
          .from('carts')
          .select('cart')
          .eq('user_id', this.user)
        if (error) { throw error }

        this._compressedCart = data[0].cart

        this._fetchingCompressed = false
      } else {
        this._compressedCart = []
      }
    },

    // Perform synchronisation of locally stored cart and cart in database
    async _updateDatabase (): Promise<void> {
      if (!this._noSync) {
        this._updating = true

        if (this.user) {
          const { error } = await supabase
            .from('carts')
            .update({ cart: this._compressedCart })
            .eq('user_id', this.user)

          if (error) { throw error }
        } else {
          throw new Error(`Cart sync went wrong. ${this.user} is not a valid user ID`)
        }
        this._updating = false
      }
    },

    // Perform adding product in both compressed and full cart lists and sync with database
    async _addToCart (id: ProductID, qty: number = 1): Promise<void> {
      // Get product info from database
      const { data: products, error } = await supabase
        .from('goods')
        .select()
        .eq('pk_id', id)

      if (error) { throw error }
      if (Array.isArray(products) && products[0] && qty > 0) {
        const product: Product = products[0]
        if (this._compressedCart && this.cart) {
          this._compressedCart.push({ pk_id: product.pk_id, qty })
          this.cart.push({ ...product, qty, checked: DEFAULT_CHECKBOX_VALUE })
        }
        await this._updateDatabase()
      } else {
        throw new Error(`Something went wrong during adding to cart of product with ID ${id}.`)
      }
    },

    // Perform removing product from both compressed and full cart lists
    // and sync with database if no noSync arg is provided
    async _removeFromCart (id: ProductID, noSync: boolean = false): Promise<void> {
      if (this._compressedCart && this.cart) {
        this._compressedCart = this._compressedCart.filter(p => p.pk_id !== id)
        this.cart = this.cart.filter(p => p.pk_id !== id)
      }

      if (!noSync) {
        await this._updateDatabase()
      }
    },

    // Perform adding or removing product from cart depending on qty arg value and isInCart getter.
    // Qty arg is ignored if product is in cart
    async handleCartAction (id: ProductID, qty: number = 1): Promise<void> {
      // Fetch cart if needed
      if (!this.cart) { await this.getCartFromDatabase() }

      const isInCart = this.isInCart(id)
      if (isInCart && id > 0) {
        await this._removeFromCart(id)
      } else if (!isInCart && qty > 0 && id > 0) {
        await this._addToCart(id, qty)
      } else {
        throw new Error(`Something went wrong when handling cart action. ID: ${id}, qty: ${qty}.`)
      }
    },

    // Handle changing quantity of product in cart.
    // If value is lower than quantity of product in cart, product will be removed from cart
    async changeQuantity (id: ProductID, value: number): Promise<void> {
      if (!this._compressedCart || !this.cart) {
        throw new Error('Please wait until cart is loaded.')
      }

      if (!this.isInCart(id)) {
        throw new Error(`Product with ID ${id} isn't in cart.`)
      }

      const product = this.cart.find(p => p.pk_id === id)
      const productInCompressedCart = this._compressedCart.find(p => p.pk_id === id)

      if (product && productInCompressedCart) {
        // Handle quantity increase
        if (value > 0 && product.qty + value <= product.units_in_stock) {
          product.qty += value
          productInCompressedCart.qty += value
        } else if (product.qty + value > product.units_in_stock) {
          product.qty = product.units_in_stock
          productInCompressedCart.qty = product.units_in_stock
        }

        // Handle quantity decrease
        if (value < 0 && product.qty + value > 0) {
          product.qty += value
          productInCompressedCart.qty += value
        } else if (product.qty + value <= 0) {
          await this._removeFromCart(product.pk_id)
        }
      }
    },

    // Invert checked value for product with provided ID
    handleCheck (id: ProductID): void {
      if (this.isInCart(id) && this.cart) {
        const product = this.cart.find(item => item.pk_id === id)
        if (product) { product.checked = !product.checked }
      }
    },
    // Check/uncheck all products in cart
    handleCheckAllClick (): void {
      // Will check all first if some products were unchecked
      const allCheckedBeforeClick = this.allChecked
      if (this.cart) {
        for (const product of this.cart) {
          product.checked = !allCheckedBeforeClick
        }
      }
    },
    // Perform removing all checked products from cart
    async removeCheckedItems (): Promise<void> {
      if (this.cart) {
        const checkedIDs = this.cart.filter(p => p.checked).map(p => p.pk_id)
        for (const id of checkedIDs) {
          await this._removeFromCart(id, true)
        }
        await this._updateDatabase()
      }
    },

    // Reset both compressed and full carts
    // Sync with database if withUpdate arg is true
    async resetCart (withUpdate: boolean = false): Promise<void> {
      this.cart = null
      this._compressedCart = null

      if (withUpdate) {
        await this._updateDatabase()
      }
    },

    disableSync (): void {
      this._noSync = true
    }
  }
})
