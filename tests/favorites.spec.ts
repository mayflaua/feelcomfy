import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFavoritesStore } from '~/stores/favorites'
import { FavoritesListItemWithRating } from '~/types/favorites'

describe('Favorites Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const user = '908ad5c6-a555-4a52-a1e5-f5023e96f344'
  const product: FavoritesListItemWithRating = {
    pk_id: 30,
    category_id: 4,
    title: 'Стол компьютерный Cougar Royal 120 черный',
    old_price: null,
    final_price: 38499,
    units_in_stock: 12,
    color: 'Черный',
    orders: 20,
    description: 'Эргономичный компьютерный стол Cougar Royal 120 с изменяемой высотой. Регулировка по высоте осуществляется при помощи встроенного электропривода легко и быстро, а благодаря ее широкому диапазону работать за компьютером теперь можно как сидя, так и стоя. Оснащен двухмоторным механизмом регулировки высоты.',
    fts: "'120':6,45 'cougar':4,43 'royal':5,44 'благодар':22 'быстр':20 'встроен':16 'высот':9,12,40 'двухмоторн':37 'диапазон':25 'изменя':8 'компьютер':28 'компьютерн':2,42 'легк':18 'механизм':38 'оснащ':36 'осуществля':13 'помощ':15 'работа':26 'регулировк':10,39 'сид':32 'сто':35 'стол':3,41 'черн':46 'широк':24 'электропривод':17 'эргономичн':1",
    netlify_name: '21.jpg',
    model: null,
    netlify_images: null,
    additional_data: null,
    reviews: 0,
    score: '0.0'
  }

  it('Initialized correctly', () => {
    const store = useFavoritesStore()
    expect(store._compressedFavorites).toBeNull()
    expect(store.favorites).toBeNull()
  })

  it('Sets the user correctly', () => {
    const store = useFavoritesStore()
    store.setUser(user)
    expect(store.user).toEqual(user)
  })

  it('Loads the compressed favorites', async () => {
    const store = useFavoritesStore()
    store.setUser(user)
    await store._getCompressedFavorites()
    expect(store._compressedFavorites).toBeTypeOf('object')
  })

  it('Loads the favorites correctly when compressed favorites is null', async () => {
    const store = useFavoritesStore()
    store.setUser(user)
    expect(store._compressedFavorites).toBeNull()
    await store.getFavoritesFromDatabase()

    expect(store._compressedFavorites).toBeTruthy()
    expect(store.favorites).toBeTruthy()
    expect(store._compressedFavorites!.length).toEqual(store.favorites!.length)
  })

  it('Returns a valid totalFavorites getter value', () => {
    const store = useFavoritesStore()
    store.setCompressedFavorites([0, 0, 23])

    expect(store.totalFavorites).toBe(3)
  })

  it('Adds a product to favorites', async () => {
    const store = useFavoritesStore()
    store.disableSync()
    store.setFavorites([])
    store.setCompressedFavorites([])

    await store.handleFavoritesAction(product.pk_id)
    expect(store._compressedFavorites).toContain(product.pk_id)
    expect(store.favorites).toContainEqual(product)
  })

  it('Removes a product from favorites', async () => {
    const store = useFavoritesStore()
    store.disableSync()
    store.setFavorites([product])
    store.setCompressedFavorites([product.pk_id])

    await store.handleFavoritesAction(product.pk_id)

    expect(store._compressedFavorites).not.toContain(product.pk_id)
    expect(store.favorites).not.toContainEqual(product)
  })

  it('Adds a product when favorites is null', async () => {
    const store = useFavoritesStore()
    store.setUser(user)
    store.disableSync()

    expect(store._compressedFavorites).toBeNull()
    expect(store.favorites).toBeNull()

    await store.handleFavoritesAction(product.pk_id)
    expect(store._compressedFavorites).toContain(product.pk_id)
    expect(store.favorites).toContainEqual(product)
  })

  it('Throws an error when user is null', async () => {
    const store = useFavoritesStore()
    store.setCompressedFavorites([1, 2, 3])

    await expect(store._updateDatabase).rejects.toThrow(/went wrong/)
  })

  it('Throws an error when user is invalid', async () => {
    const store = useFavoritesStore()
    store.setUser('invalid')

    await expect(store.getFavoritesFromDatabase).rejects.toThrow()
  })

  it('Resets the favorites', async () => {
    const store = useFavoritesStore()
    store.setUser(user)
    store.disableSync()
    await store.getFavoritesFromDatabase()

    await store.resetFavorites()

    expect(store._compressedFavorites).toBeNull()
    expect(store.favorites).toBeNull()
  })
})
