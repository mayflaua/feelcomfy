import { useFavoritesStore } from '~/stores/favorites'
import { useCartStore } from '~/stores/cart'

const useAuth = () => {
  const user = useState('user', () => null)
  const { supabase } = useSupabase()
  const router = useRouter()

  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null
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
    const favoritesStore = useFavoritesStore()
    const cartStore = useCartStore()

    favoritesStore.resetFavorites()
    cartStore.resetCart()

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
