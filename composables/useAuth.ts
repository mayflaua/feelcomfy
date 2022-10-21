import { useFavoritesStore } from '~/stores/favorites'
import { useCartStore } from '~/stores/cart'

const useAuth = () => {
  const user = useState('user', () => null)
  const { supabase } = useSupabase()
  const favoritesStore = useFavoritesStore()
  const cartStore = useCartStore()

  supabase.auth.onAuthStateChange(async (event, session) => {
    user.value = session?.user || null

    if (event === 'SIGNED_IN' &&
      !cartStore.cartReady &&
      !favoritesStore.favoritesReady &&
      !favoritesStore._fetchingCompressed &&
      !cartStore._fetchingCompressed) {
      const t = performance.now()
      await favoritesStore.getCompressedFavoritesList()
      await cartStore.getCompressedCart()
      console.info(`fetched cart and favorites in ${performance.now() - t}ms`)
    } else if (event === 'SIGNED_OUT') {
      favoritesStore.resetFavorites()
      cartStore.resetCart()
      console.info('reset cart and favorites')
    }
  })

  const signUp = async ({ email, password, ...metadata }) => {
    const { user: u, error } = await supabase.auth.signUp(
      { email, password },
      { data: metadata }
    )
    await supabase.from('carts').insert({
      user_id: u.id,
      cart: []
    })
    await supabase.from('favorites').insert({
      user_id: u.id,
      favorites: []
    })
    if (error) {
      throw error
    }
    return u
  }

  const signIn = async ({ email, password }) => {
    const { user: u, error } = await supabase.auth.signIn({ email, password })
    if (error) {
      throw error
    }
    return u
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    localStorage.removeItem('supabase.auth.token')

    if (error) {
      throw error
    }
    await navigateTo('/')
  }

  const isLoggedIn = () => {
    return !!user.value
  }

  return { user, signUp, signIn, signOut, isLoggedIn }
}

export default useAuth
