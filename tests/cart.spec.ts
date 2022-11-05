import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCartStore } from '~/stores/cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const user = '908ad5c6-a555-4a52-a1e5-f5023e96f344'

  it('Initialized correctly', () => {
    const store = useCartStore()
    expect(store.cart).toBeNull()
    expect(store._compressedCart).toBeNull()
  })

  it('Initializing empty cart when user is null', async () => {
    const store = useCartStore()
    expect(store.user).toBeNull()

    await store.getCartFromDatabase()
    expect(store._compressedCart).toBeTruthy()
    expect(store.cart).toBeTruthy()
  })

  it('Sets the user correctly', () => {
    const store = useCartStore()
    store.setUser(user)
    expect(store.user).toEqual(user)
  })

  it('Loads the compressed cart', async () => {
    const store = useCartStore()
    store.setUser(user)
    await store._getCompressedCart()
    expect(store._compressedCart).toBeTypeOf('object')
  })

  it('Loads the cart correctly when compressed cart is null', async () => {
    const store = useCartStore()
    store.setUser(user)
    expect(store._compressedCart).toBeNull()
    await store.getCartFromDatabase()

    expect(store._compressedCart).toBeTruthy()
    expect(store.cart).toBeTruthy()
    expect(store._compressedCart.length).toEqual(store.cart.length)
  })

  it('Adds checked and qty properties to cart products', async () => {
    const store = useCartStore()
    store.setUser(user)
    await store.getCartFromDatabase()

    for (const product of store.cart) {
      expect(product).toHaveProperty('checked')
      expect(product).toHaveProperty('qty')
    }
  })

  it('Adds a product to cart', async () => {
    const store = useCartStore()
    store.setUser(user)
    store.disableSync()
    await store.getCartFromDatabase()

    await store._removeFromCart(30, true)
    expect(store._compressedCart).not.toContainEqual({ pk_id: 30, qty: 1 })
    await store.handleCartAction(30, 1)

    expect(store._compressedCart).toContainEqual({ pk_id: 30, qty: 1 })
  })

  it('Adds a product to cart when cart is null', async () => {
    const store = useCartStore()
    store.setUser(user)
    store.disableSync()

    await store.handleCartAction(123, 1)
    expect(store._compressedCart).toContainEqual({ pk_id: 123, qty: 1 })
  })

  it('Throws an error when handling cart action with wrong values', async () => {
    const store = useCartStore()
    store.setUser(user)
    store.disableSync()
    await store.getCartFromDatabase()

    await expect(store.handleCartAction(-2, -2)).rejects.toThrow(/Something went wrong/)
  })

  it('Increases the quantity', async () => {
    const store = useCartStore()
    store.setUser(user)
    store.disableSync()
    await store.getCartFromDatabase()

    const product = { ...store._compressedCart[1] }
    await store.changeQuantity(product.pk_id, 2)
    expect(store._compressedCart).toContainEqual({ pk_id: product.pk_id, qty: product.qty + 2 })
  })

  it('Decreases the quantity', async () => {
    const store = useCartStore()
    store.setUser(user)
    store.disableSync()
    await store.getCartFromDatabase()

    const product = { ...store._compressedCart[2] }
    await store.changeQuantity(product.pk_id, -2)
    expect(store._compressedCart).toContainEqual({ pk_id: product.pk_id, qty: product.qty - 2 })
  })

  it('Throws an error when changing quantity of product and cart is null', async () => {
    const store = useCartStore()
    store.setUser(user)
    store.disableSync()

    await expect(store.changeQuantity(17, 1)).rejects.toThrow(/Please wait/)
  })

  it('Throws an error when changing quantity of product that is not in cart', async () => {
    const store = useCartStore()
    store.setUser(user)
    store.disableSync()
    await store.getCartFromDatabase()

    await expect(store.changeQuantity(1207, 1)).rejects.toThrow(/Product/)
  })

  it('Removes the product if changing quantity to 0', async () => {
    const store = useCartStore()
    store.setUser(user)
    store.disableSync()
    await store.getCartFromDatabase()

    const product = store.cart[0]
    await store.changeQuantity(product.pk_id, -product.qty)
    expect(store._compressedCart).not.toContainEqual({ pk_id: product.pk_id, qty: product.qty })
  })

  it('Sets the quantity to units_in_stock if value is more than units_in_stock', async () => {
    const store = useCartStore()
    store.setUser(user)
    store.disableSync()
    await store.getCartFromDatabase()

    const product = store.cart[0]
    await store.changeQuantity(product.pk_id, product.units_in_stock + 100)
    expect(store._compressedCart).toContainEqual({ pk_id: product.pk_id, qty: product.units_in_stock })
  })

  it('Checks every product on init', async () => {
    const store = useCartStore()
    store.setUser(user)
    await store.getCartFromDatabase()

    for (const product of store.cart) {
      expect(product.checked).toBeTruthy()
    }
  })

  it('Checks every product when first is unchecked', async () => {
    const store = useCartStore()
    store.setUser(user)
    await store.getCartFromDatabase()

    store.handleCheck(store.cart[0].pk_id)
    expect(store.cart[0].checked).toBeFalsy()
    store.handleCheckAllClick()
    for (const product of store.cart) {
      expect(product.checked).toBeTruthy()
    }
  })

  it('Unchecks every product when all are checked', async () => {
    const store = useCartStore()
    store.setUser(user)
    await store.getCartFromDatabase()

    for (const product of store.cart) {
      expect(product.checked).toBeTruthy()
    }
    store.handleCheckAllClick()
    for (const product of store.cart) {
      expect(product.checked).toBeFalsy()
    }
  })

  it('Removes checked products', async () => {
    const store = useCartStore()
    store.setUser(user)
    store.disableSync()
    await store.getCartFromDatabase()

    const products = [store.cart[0], store.cart[1], store.cart[2]]
    store.handleCheckAllClick()
    for (const product of store.cart) {
      expect(product.checked).toBeFalsy()
    }
    for (const product of products) {
      store.handleCheck(product.pk_id)
    }
    await store.removeCheckedItems()
    expect(store.cart).not.toContainEqual(products[0])
    expect(store.cart).not.toContainEqual(products[1])
    expect(store.cart).not.toContainEqual(products[2])
  })

  it('Resets the cart', async () => {
    const store = useCartStore()
    store.setUser(user)
    store.disableSync()
    await store.getCartFromDatabase()

    await store.resetCart()

    expect(store.cart).toBeNull()
    expect(store._compressedCart).toBeNull()
  })
})
